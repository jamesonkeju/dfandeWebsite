using System.Text;
using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Analytics.Queries.ExportAnalyticsReport;

public record ExportAnalyticsReportQuery(
    DateTime? From = null,
    DateTime? To = null) : IRequest<AnalyticsExportResult>;

public record AnalyticsExportResult(
    byte[] FileBytes,
    string ContentType,
    string FileName);

public class ExportAnalyticsReportQueryHandler(IApplicationDbContext context)
    : IRequestHandler<ExportAnalyticsReportQuery, AnalyticsExportResult>
{
    public async Task<AnalyticsExportResult> Handle(ExportAnalyticsReportQuery request, CancellationToken cancellationToken)
    {
        var fromUtc = request.From?.ToUniversalTime().Date ?? DateTime.UtcNow.Date.AddDays(-30);
        var toUtc = request.To?.ToUniversalTime().Date.AddDays(1).AddTicks(-1) ?? DateTime.UtcNow;

        var logs = await context.VisitorLogs
            .AsNoTracking()
            .Where(v => v.TimestampUtc >= fromUtc && v.TimestampUtc <= toUtc)
            .OrderByDescending(v => v.TimestampUtc)
            .Take(10000)
            .ToListAsync(cancellationToken);

        var csv = new StringBuilder();
        csv.AppendLine("Timestamp (UTC),Session ID,Visited Path,Device,Operating System,Browser,Referrer,Duration (Seconds)");

        foreach (var log in logs)
        {
            var cleanReferrer = EscapeCsv(log.Referrer ?? "Direct");
            var cleanPath = EscapeCsv(log.Path);
            var cleanSession = EscapeCsv(log.SessionId);
            csv.AppendLine($"{log.TimestampUtc:yyyy-MM-dd HH:mm:ss},{cleanSession},{cleanPath},{log.DeviceType},{log.OperatingSystem},{log.Browser},{cleanReferrer},{log.DurationSeconds}");
        }

        var fileName = $"DFANDE_Visitor_Analytics_{fromUtc:yyyyMMdd}_to_{toUtc:yyyyMMdd}.csv";
        var bytes = Encoding.UTF8.GetBytes(csv.ToString());

        return new AnalyticsExportResult(bytes, "text/csv", fileName);
    }

    private static string EscapeCsv(string field)
    {
        if (string.IsNullOrEmpty(field)) return "\"\"";
        if (field.Contains(',') || field.Contains('"') || field.Contains('\n') || field.Contains('\r'))
        {
            return $"\"{field.Replace("\"", "\"\"")}\"";
        }
        return $"\"{field}\"";
    }
}
