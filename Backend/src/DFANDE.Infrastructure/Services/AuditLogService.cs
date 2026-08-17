using System.Security.Claims;
using System.Text.Json;
using DFANDE.Application.Common.Interfaces;
using DFANDE.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace DFANDE.Infrastructure.Services;

public class AuditLogService(
    IApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor,
    ILogger<AuditLogService> logger) : IAuditLogService
{
    public async Task LogAsync(
        string action,
        string entityName,
        string? entityId = null,
        object? details = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var httpContext = httpContextAccessor.HttpContext;
            Guid? userId = null;
            var userEmail = "system@dfande.local";
            var displayName = "System Service";
            string? ipAddress = null;

            if (httpContext?.User?.Identity?.IsAuthenticated == true)
            {
                var idClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (Guid.TryParse(idClaim, out var parsedId))
                {
                    userId = parsedId;
                }

                userEmail = httpContext.User.FindFirst(ClaimTypes.Email)?.Value
                    ?? httpContext.User.FindFirst("email")?.Value
                    ?? httpContext.User.Identity?.Name
                    ?? "authenticated-user";

                displayName = httpContext.User.FindFirst("displayName")?.Value
                    ?? httpContext.User.FindFirst(ClaimTypes.Name)?.Value
                    ?? userEmail;

                ipAddress = httpContext.Connection.RemoteIpAddress?.ToString();
            }

            string? detailsJson = null;
            if (details is not null)
            {
                if (details is string strDetails)
                {
                    detailsJson = strDetails;
                }
                else
                {
                    detailsJson = JsonSerializer.Serialize(details);
                }
            }

            var logEntry = AuditLog.Create(
                userId: userId,
                userEmail: userEmail,
                userDisplayName: displayName,
                action: action,
                entityName: entityName,
                entityId: entityId,
                detailsJson: detailsJson,
                ipAddress: ipAddress);

            context.AuditLogs.Add(logEntry);
            await context.SaveChangesAsync(cancellationToken);

            logger.LogInformation(
                "Audit Log created: [{Action}] on {EntityName}:{EntityId} by {UserEmail}",
                action,
                entityName,
                entityId ?? "N/A",
                userEmail);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to persist audit log for Action: {Action}, Entity: {EntityName}", action, entityName);
        }
    }
}
