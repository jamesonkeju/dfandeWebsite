using DFANDE.Application.Common.Exceptions;
using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Projects.Commands.UpdateProject;

public record UpdateProjectCommand(
    Guid Id,
    string Client,
    string Scope,
    string Location,
    string Year,
    string Category,
    string? ImageUrl,
    int DisplayOrder,
    bool IsFeatured) : IRequest;

public class UpdateProjectCommandHandler(IApplicationDbContext context) : IRequestHandler<UpdateProjectCommand>
{
    public async Task Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await context.Projects.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Project), request.Id);

        project.Update(
            request.Client, request.Scope, request.Location, request.Year, request.Category, request.ImageUrl,
            request.DisplayOrder, request.IsFeatured);

        await context.SaveChangesAsync(cancellationToken);
    }
}
