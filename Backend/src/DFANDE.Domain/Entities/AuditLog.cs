using DFANDE.Domain.Common;

namespace DFANDE.Domain.Entities;

public class AuditLog : BaseEntity
{
    public Guid? UserId { get; private set; }
    public string UserEmail { get; private set; } = string.Empty;
    public string UserDisplayName { get; private set; } = string.Empty;
    public string Action { get; private set; } = string.Empty; // e.g. "AUTH_LOGIN", "CREATE_SERVICE", "UPDATE_PROJECT", "PASSWORD_CHANGE"
    public string EntityName { get; private set; } = string.Empty; // e.g. "Service", "Project", "ApplicationUser"
    public string? EntityId { get; private set; }
    public string? DetailsJson { get; private set; }
    public string? IpAddress { get; private set; }
    public DateTime TimestampUtc { get; private set; } = DateTime.UtcNow;

    private AuditLog() { }

    public static AuditLog Create(
        Guid? userId,
        string userEmail,
        string userDisplayName,
        string action,
        string entityName,
        string? entityId = null,
        string? detailsJson = null,
        string? ipAddress = null)
    {
        return new AuditLog
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            UserEmail = string.IsNullOrWhiteSpace(userEmail) ? "anonymous" : userEmail,
            UserDisplayName = string.IsNullOrWhiteSpace(userDisplayName) ? "System / Guest" : userDisplayName,
            Action = action,
            EntityName = entityName,
            EntityId = entityId,
            DetailsJson = detailsJson,
            IpAddress = ipAddress,
            TimestampUtc = DateTime.UtcNow,
        };
    }
}
