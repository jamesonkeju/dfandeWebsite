using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Services.Queries.GetServiceBySlug;

public record GetServiceBySlugQuery(string Slug) : IRequest<ServiceDto?>;

public class GetServiceBySlugQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetServiceBySlugQuery, ServiceDto?>
{
    public async Task<ServiceDto?> Handle(GetServiceBySlugQuery request, CancellationToken cancellationToken)
    {
        return await context.Services
            .Where(s => s.Slug == request.Slug && s.IsPublished)
            .Select(s => new ServiceDto(
                s.Id, s.Title, s.Slug, s.Summary, s.Scope, s.Icon, s.ImageUrl, s.DisplayOrder, s.IsFeatured, s.IsPublished))
            .FirstOrDefaultAsync(cancellationToken);
    }
}
