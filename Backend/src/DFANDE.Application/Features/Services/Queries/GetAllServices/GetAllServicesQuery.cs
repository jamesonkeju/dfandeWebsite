using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Services.Queries.GetAllServices;

/// <summary>CMS-only — every service regardless of published state.</summary>
public record GetAllServicesQuery : IRequest<List<ServiceDto>>;

public class GetAllServicesQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetAllServicesQuery, List<ServiceDto>>
{
    public async Task<List<ServiceDto>> Handle(GetAllServicesQuery request, CancellationToken cancellationToken)
    {
        return await context.Services
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new ServiceDto(
                s.Id, s.Title, s.Slug, s.Summary, s.Scope, s.Icon, s.ImageUrl, s.DisplayOrder, s.IsFeatured, s.IsPublished))
            .ToListAsync(cancellationToken);
    }
}
