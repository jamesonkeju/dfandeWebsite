using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Contact.Queries.GetContactSubmissions;

/// <summary>
/// Not yet auth-protected — no Identity/roles exist in this pass (deferred
/// to the CMS/auth phase). The WebApi endpoint exposing this is marked
/// accordingly; do not treat it as production-safe until that lands.
/// </summary>
public record GetContactSubmissionsQuery : IRequest<List<ContactSubmissionDto>>;

public class GetContactSubmissionsQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetContactSubmissionsQuery, List<ContactSubmissionDto>>
{
    public async Task<List<ContactSubmissionDto>> Handle(
        GetContactSubmissionsQuery request,
        CancellationToken cancellationToken)
    {
        return await context.ContactSubmissions
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new ContactSubmissionDto(
                s.Id,
                s.Name,
                s.Email,
                s.Phone,
                s.Subject,
                s.Message,
                s.ServiceOfInterest,
                s.Status.ToString(),
                s.CreatedAt))
            .ToListAsync(cancellationToken);
    }
}
