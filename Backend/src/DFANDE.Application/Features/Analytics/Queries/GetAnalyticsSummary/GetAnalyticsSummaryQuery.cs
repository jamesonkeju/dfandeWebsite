using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Analytics.Queries.GetAnalyticsSummary;

public record MetricCard(
    string Label,
    long Value,
    double ChangePercent,
    string PeriodNote);

public record TrendDataPoint(
    string Date,
    int PageViews,
    int UniqueVisitors);

public record TopPageMetric(
    string Path,
    int Views,
    int UniqueVisitors,
    double Percentage);

public record BreakdownItem(
    string Name,
    int Count,
    double Percentage);

public record VisitorLogItemDto(
    Guid Id,
    string Path,
    string? Referrer,
    string Browser,
    string OperatingSystem,
    string DeviceType,
    int DurationSeconds,
    DateTime TimestampUtc);

public record AnalyticsSummaryDto(
    long TotalPageViews,
    long TotalUniqueVisitors,
    long TodayPageViews,
    long TodayUniqueVisitors,
    long Last7DaysViews,
    long Last30DaysViews,
    double AvgDurationSeconds,
    List<TrendDataPoint> TrafficTrends,
    List<TopPageMetric> TopPages,
    List<BreakdownItem> DeviceBreakdown,
    List<BreakdownItem> BrowserBreakdown,
    List<BreakdownItem> ReferrerBreakdown,
    List<VisitorLogItemDto> RecentVisits);

public record GetAnalyticsSummaryQuery(int Days = 30) : IRequest<AnalyticsSummaryDto>;

public class GetAnalyticsSummaryQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetAnalyticsSummaryQuery, AnalyticsSummaryDto>
{
    public async Task<AnalyticsSummaryDto> Handle(GetAnalyticsSummaryQuery request, CancellationToken cancellationToken)
    {
        var days = Math.Clamp(request.Days, 1, 365);
        var startDate = DateTime.UtcNow.Date.AddDays(-days + 1);
        var todayStart = DateTime.UtcNow.Date;
        var sevenDaysAgo = DateTime.UtcNow.Date.AddDays(-7);
        var thirtyDaysAgo = DateTime.UtcNow.Date.AddDays(-30);

        var query = context.VisitorLogs.AsNoTracking();

        var totalViews = await query.LongCountAsync(cancellationToken);
        var totalUnique = await query.Select(v => v.SessionId).Distinct().LongCountAsync(cancellationToken);

        var todayViews = await query.Where(v => v.TimestampUtc >= todayStart).LongCountAsync(cancellationToken);
        var todayUnique = await query.Where(v => v.TimestampUtc >= todayStart).Select(v => v.SessionId).Distinct().LongCountAsync(cancellationToken);

        var last7Views = await query.Where(v => v.TimestampUtc >= sevenDaysAgo).LongCountAsync(cancellationToken);
        var last30Views = await query.Where(v => v.TimestampUtc >= thirtyDaysAgo).LongCountAsync(cancellationToken);

        var avgDuration = await query.Where(v => v.DurationSeconds > 0)
            .Select(v => (double?)v.DurationSeconds)
            .AverageAsync(cancellationToken) ?? 0;

        // Fetch logs for the requested timeframe to aggregate trends and breakdowns
        var logs = await query
            .Where(v => v.TimestampUtc >= startDate)
            .Select(v => new
            {
                v.Id,
                v.SessionId,
                v.Path,
                v.Referrer,
                v.Browser,
                v.OperatingSystem,
                v.DeviceType,
                v.DurationSeconds,
                v.TimestampUtc
            })
            .ToListAsync(cancellationToken);

        // Daily traffic trends
        var trends = logs
            .GroupBy(l => l.TimestampUtc.ToString("yyyy-MM-dd"))
            .Select(g => new TrendDataPoint(
                Date: g.Key,
                PageViews: g.Count(),
                UniqueVisitors: g.Select(x => x.SessionId).Distinct().Count()))
            .OrderBy(t => t.Date)
            .ToList();

        // Top pages
        var topPages = logs
            .GroupBy(l => l.Path)
            .Select(g => new
            {
                Path = g.Key,
                Views = g.Count(),
                Uniques = g.Select(x => x.SessionId).Distinct().Count()
            })
            .OrderByDescending(x => x.Views)
            .Take(10)
            .Select(x => new TopPageMetric(
                Path: x.Path,
                Views: x.Views,
                UniqueVisitors: x.Uniques,
                Percentage: logs.Count > 0 ? Math.Round((double)x.Views / logs.Count * 100, 1) : 0))
            .ToList();

        // Device breakdown
        var deviceBreakdown = logs
            .GroupBy(l => l.DeviceType)
            .Select(g => new BreakdownItem(
                Name: g.Key,
                Count: g.Count(),
                Percentage: logs.Count > 0 ? Math.Round((double)g.Count() / logs.Count * 100, 1) : 0))
            .OrderByDescending(b => b.Count)
            .ToList();

        // Browser breakdown
        var browserBreakdown = logs
            .GroupBy(l => l.Browser)
            .Select(g => new BreakdownItem(
                Name: g.Key,
                Count: g.Count(),
                Percentage: logs.Count > 0 ? Math.Round((double)g.Count() / logs.Count * 100, 1) : 0))
            .OrderByDescending(b => b.Count)
            .Take(6)
            .ToList();

        // Referrer breakdown
        var referrerBreakdown = logs
            .Where(l => !string.IsNullOrWhiteSpace(l.Referrer))
            .GroupBy(l => ExtractDomain(l.Referrer))
            .Select(g => new BreakdownItem(
                Name: g.Key,
                Count: g.Count(),
                Percentage: logs.Count > 0 ? Math.Round((double)g.Count() / logs.Count * 100, 1) : 0))
            .OrderByDescending(b => b.Count)
            .Take(6)
            .ToList();

        // Recent visits
        var recentVisits = logs
            .OrderByDescending(l => l.TimestampUtc)
            .Take(25)
            .Select(l => new VisitorLogItemDto(
                l.Id,
                l.Path,
                l.Referrer,
                l.Browser,
                l.OperatingSystem,
                l.DeviceType,
                l.DurationSeconds,
                l.TimestampUtc))
            .ToList();

        return new AnalyticsSummaryDto(
            TotalPageViews: totalViews,
            TotalUniqueVisitors: totalUnique,
            TodayPageViews: todayViews,
            TodayUniqueVisitors: todayUnique,
            Last7DaysViews: last7Views,
            Last30DaysViews: last30Views,
            AvgDurationSeconds: Math.Round(avgDuration, 1),
            TrafficTrends: trends,
            TopPages: topPages,
            DeviceBreakdown: deviceBreakdown,
            BrowserBreakdown: browserBreakdown,
            ReferrerBreakdown: referrerBreakdown,
            RecentVisits: recentVisits);
    }

    private static string ExtractDomain(string? url)
    {
        if (string.IsNullOrWhiteSpace(url)) return "Direct / Bookmark";
        try
        {
            if (Uri.TryCreate(url, UriKind.Absolute, out var uri))
            {
                return uri.Host;
            }
        }
        catch { }
        return url.Length > 30 ? url[..30] + "…" : url;
    }
}
