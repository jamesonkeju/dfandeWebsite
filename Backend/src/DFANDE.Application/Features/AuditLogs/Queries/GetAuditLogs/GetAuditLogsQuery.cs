using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.AuditLogs.Queries.GetAuditLogs;

public record AuditLogDto(
    Guid Id,
    Guid? UserId,
    string UserEmail,
    string UserDisplayName,
    string Action,
    string EntityName,
    string? EntityId,
    string? DetailsJson,
    string? IpAddress,
    DateTime TimestampUtc);

public record GetAuditLogsQuery(
    string? Action = null,
    string? EntityName = null,
    string? Search = null,
    int Page = 1,
    int PageSize = 50) : IRequest<AuditLogListResult>;

public record AuditLogListResult(
    List<AuditLogDto> Items,
    int TotalCount,
    int Page,
    int PageSize);

public class GetAuditLogsQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetAuditLogsQuery, AuditLogListResult>
{
    public async Task<AuditLogListResult> Handle(GetAuditLogsQuery request, CancellationToken cancellationToken)
    {
        var query = context.AuditLogs.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Action))
        {
            query = query.Where(l => l.Action == request.Action);
        }

        if (!string.IsNullOrWhiteSpace(request.EntityName))
        {
            query = query.Where(l => l.EntityName == request.EntityName);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var term = request.Search.Trim().ToLower();
            query = query.Where(l =>
                l.UserEmail.ToLower().Contains(term) ||
                l.UserDisplayName.ToLower().Contains(term) ||
                l.Action.ToLower().Contains(term) ||
                l.EntityName.ToLower().Contains(term) ||
                (l.DetailsJson != null && l.DetailsJson.ToLower().Contains(term)));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(l => l.TimestampUtc)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(l => new AuditLogDto(
                l.Id,
                l.UserId,
                l.UserEmail,
                l.UserDisplayName,
                l.Action,
                l.EntityName,
                l.EntityId,
                l.DetailsJson,
                l.IpAddress,
                l.TimestampUtc))
            .ToListAsync(cancellationToken);

        return new AuditLogListResult(items, totalCount, request.Page, request.PageSize);
    }
}
