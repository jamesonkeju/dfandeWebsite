namespace DFANDE.Application.Common.Interfaces;

public interface IAuditLogService
{
    Task LogAsync(
        string action,
        string entityName,
        string? entityId = null,
        object? details = null,
        CancellationToken cancellationToken = default);
}
