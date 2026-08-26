using DFANDE.Domain.Common;

namespace DFANDE.Domain.Entities;

public class VisitorLog : BaseEntity
{
    public string SessionId { get; private set; } = string.Empty;
    public string Path { get; private set; } = string.Empty;
    public string? QueryString { get; private set; }
    public string? Referrer { get; private set; }
    public string? UserAgent { get; private set; }
    public string Browser { get; private set; } = "Unknown";
    public string OperatingSystem { get; private set; } = "Unknown";
    public string DeviceType { get; private set; } = "Desktop"; // Desktop, Mobile, Tablet, Bot
    public string? IpHash { get; private set; }
    public string? Country { get; private set; }
    public string? City { get; private set; }
    public int DurationSeconds { get; private set; }
    public DateTime TimestampUtc { get; private set; } = DateTime.UtcNow;

    private VisitorLog() { }

    public static VisitorLog Create(
        string sessionId,
        string path,
        string? queryString = null,
        string? referrer = null,
        string? userAgent = null,
        string? browser = null,
        string? operatingSystem = null,
        string? deviceType = null,
        string? ipHash = null,
        string? country = null,
        string? city = null,
        int durationSeconds = 0)
    {
        return new VisitorLog
        {
            Id = Guid.NewGuid(),
            SessionId = string.IsNullOrWhiteSpace(sessionId) ? Guid.NewGuid().ToString("N") : sessionId.Trim(),
            Path = string.IsNullOrWhiteSpace(path) ? "/" : path.Trim(),
            QueryString = queryString?.Trim(),
            Referrer = referrer?.Trim(),
            UserAgent = userAgent?.Trim(),
            Browser = string.IsNullOrWhiteSpace(browser) ? "Unknown" : browser.Trim(),
            OperatingSystem = string.IsNullOrWhiteSpace(operatingSystem) ? "Unknown" : operatingSystem.Trim(),
            DeviceType = string.IsNullOrWhiteSpace(deviceType) ? "Desktop" : deviceType.Trim(),
            IpHash = ipHash?.Trim(),
            Country = country?.Trim(),
            City = city?.Trim(),
            DurationSeconds = Math.Max(0, durationSeconds),
            TimestampUtc = DateTime.UtcNow,
        };
    }

    public void UpdateDuration(int durationSeconds)
    {
        if (durationSeconds > DurationSeconds)
        {
            DurationSeconds = durationSeconds;
        }
    }
}
