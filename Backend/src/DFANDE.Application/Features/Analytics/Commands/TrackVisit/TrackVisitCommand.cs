using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using DFANDE.Application.Common.Interfaces;
using DFANDE.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Analytics.Commands.TrackVisit;

public record TrackVisitCommand(
    string SessionId,
    string Path,
    string? QueryString = null,
    string? Referrer = null,
    string? UserAgent = null,
    string? IpAddress = null,
    int DurationSeconds = 0) : IRequest<Guid>;

public class TrackVisitCommandHandler(IApplicationDbContext context)
    : IRequestHandler<TrackVisitCommand, Guid>
{
    public async Task<Guid> Handle(TrackVisitCommand request, CancellationToken cancellationToken)
    {
        var (browser, os, deviceType) = ParseUserAgent(request.UserAgent);
        var ipHash = HashIp(request.IpAddress);

        // Sanitize path
        var rawPath = string.IsNullOrWhiteSpace(request.Path) ? "/" : request.Path.Trim();
        if (rawPath.Length > 500) rawPath = rawPath[..500];

        // Check if updating duration on existing visit within the last 5 minutes on same path and session
        var cutoff = DateTime.UtcNow.AddMinutes(-5);
        var existing = await context.VisitorLogs
            .Where(v => v.SessionId == request.SessionId && v.Path == rawPath && v.TimestampUtc >= cutoff)
            .OrderByDescending(v => v.TimestampUtc)
            .FirstOrDefaultAsync(cancellationToken);

        if (existing != null && request.DurationSeconds > 0)
        {
            existing.UpdateDuration(request.DurationSeconds);
            await context.SaveChangesAsync(cancellationToken);
            return existing.Id;
        }

        var log = VisitorLog.Create(
            sessionId: request.SessionId,
            path: rawPath,
            queryString: request.QueryString,
            referrer: request.Referrer,
            userAgent: request.UserAgent,
            browser: browser,
            operatingSystem: os,
            deviceType: deviceType,
            ipHash: ipHash,
            durationSeconds: request.DurationSeconds);

        context.VisitorLogs.Add(log);
        await context.SaveChangesAsync(cancellationToken);

        return log.Id;
    }

    private static (string Browser, string Os, string DeviceType) ParseUserAgent(string? ua)
    {
        if (string.IsNullOrWhiteSpace(ua))
            return ("Unknown", "Unknown", "Desktop");

        var lower = ua.ToLowerInvariant();

        // Device
        string device = "Desktop";
        if (lower.Contains("mobile") || lower.Contains("iphone") || lower.Contains("android") && !lower.Contains("tablet"))
        {
            device = "Mobile";
        }
        else if (lower.Contains("ipad") || lower.Contains("tablet"))
        {
            device = "Tablet";
        }
        else if (lower.Contains("bot") || lower.Contains("crawl") || lower.Contains("spider") || lower.Contains("slurp"))
        {
            device = "Bot";
        }

        // OS
        string os = "Other";
        if (lower.Contains("windows")) os = "Windows";
        else if (lower.Contains("mac os") || lower.Contains("macintosh")) os = "macOS";
        else if (lower.Contains("iphone") || lower.Contains("ipad") || lower.Contains("ios")) os = "iOS";
        else if (lower.Contains("android")) os = "Android";
        else if (lower.Contains("linux")) os = "Linux";

        // Browser
        string browser = "Other";
        if (lower.Contains("edg/")) browser = "Edge";
        else if (lower.Contains("chrome/") && !lower.Contains("edg/")) browser = "Chrome";
        else if (lower.Contains("safari/") && !lower.Contains("chrome/")) browser = "Safari";
        else if (lower.Contains("firefox/")) browser = "Firefox";
        else if (lower.Contains("opr/") || lower.Contains("opera/")) browser = "Opera";

        return (browser, os, device);
    }

    private static string? HashIp(string? ip)
    {
        if (string.IsNullOrWhiteSpace(ip)) return null;
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(ip.Trim()));
        return Convert.ToHexString(bytes)[..16]; // Truncated anonymized hash for privacy
    }
}
