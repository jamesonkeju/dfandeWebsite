using DFANDE.Application.Common.Interfaces;
using DFANDE.Domain.Entities;
using MediatR;

namespace DFANDE.Application.Features.Projects.Commands.CreateProject;

public record CreateProjectCommand(
    string Client,
    string Scope,
    string Location,
    string Year,
    string Category,
    string? ImageUrl,
    int DisplayOrder,
    bool IsFeatured,
    bool IsPublished) : IRequest<Guid>;

public class CreateProjectCommandHandler(IApplicationDbContext context) : IRequestHandler<CreateProjectCommand, Guid>
{
    public async Task<Guid> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = Project.Create(
            request.Client, request.Scope, request.Location, request.Year, request.Category, request.ImageUrl,
            request.DisplayOrder, request.IsFeatured, request.IsPublished);

        context.Projects.Add(project);
        await context.SaveChangesAsync(cancellationToken);

        return project.Id;
    }
}
