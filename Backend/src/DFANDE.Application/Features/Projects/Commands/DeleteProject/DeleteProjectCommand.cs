using DFANDE.Application.Common.Exceptions;
using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Projects.Commands.DeleteProject;

public record DeleteProjectCommand(Guid Id) : IRequest;

public class DeleteProjectCommandHandler(IApplicationDbContext context) : IRequestHandler<DeleteProjectCommand>
{
    public async Task Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await context.Projects.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Project), request.Id);

        context.Projects.Remove(project);
        await context.SaveChangesAsync(cancellationToken);
    }
}
