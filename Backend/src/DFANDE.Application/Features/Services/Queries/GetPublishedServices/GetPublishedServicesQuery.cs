using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Services.Queries.GetPublishedServices;

/// <summary>Public — what the homepage and /services page render.</summary>
public record GetPublishedServicesQuery : IRequest<List<ServiceDto>>;

public class GetPublishedServicesQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetPublishedServicesQuery, List<ServiceDto>>
{
    public async Task<List<ServiceDto>> Handle(GetPublishedServicesQuery request, CancellationToken cancellationToken)
    {
        return await context.Services
            .Where(s => s.IsPublished)
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new ServiceDto(
                s.Id, s.Title, s.Slug, s.Summary, s.Scope, s.Icon, s.ImageUrl, s.DisplayOrder, s.IsFeatured, s.IsPublished))
            .ToListAsync(cancellationToken);
    }
}
