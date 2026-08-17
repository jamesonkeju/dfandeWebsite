using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Projects.Queries.GetPublishedProjects;

/// <summary>Public — what the /projects page and the homepage's featured section render.</summary>
public record GetPublishedProjectsQuery : IRequest<List<ProjectDto>>;

public class GetPublishedProjectsQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetPublishedProjectsQuery, List<ProjectDto>>
{
    public async Task<List<ProjectDto>> Handle(GetPublishedProjectsQuery request, CancellationToken cancellationToken)
    {
        return await context.Projects
            .Where(p => p.IsPublished)
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new ProjectDto(
                p.Id, p.Client, p.Scope, p.Location, p.Year, p.Category, p.ImageUrl, p.DisplayOrder, p.IsFeatured, p.IsPublished))
            .ToListAsync(cancellationToken);
    }
}
