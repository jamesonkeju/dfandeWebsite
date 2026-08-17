using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Projects.Queries.GetAllProjects;

/// <summary>CMS-only — every project regardless of published state.</summary>
public record GetAllProjectsQuery : IRequest<List<ProjectDto>>;

public class GetAllProjectsQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetAllProjectsQuery, List<ProjectDto>>
{
    public async Task<List<ProjectDto>> Handle(GetAllProjectsQuery request, CancellationToken cancellationToken)
    {
        return await context.Projects
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new ProjectDto(
                p.Id, p.Client, p.Scope, p.Location, p.Year, p.Category, p.ImageUrl, p.DisplayOrder, p.IsFeatured, p.IsPublished))
            .ToListAsync(cancellationToken);
    }
}
