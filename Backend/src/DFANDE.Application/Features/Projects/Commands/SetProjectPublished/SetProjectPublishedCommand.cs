using DFANDE.Application.Common.Exceptions;
using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Projects.Commands.SetProjectPublished;

public record SetProjectPublishedCommand(Guid Id, bool IsPublished) : IRequest;

public class SetProjectPublishedCommandHandler(IApplicationDbContext context)
    : IRequestHandler<SetProjectPublishedCommand>
{
    public async Task Handle(SetProjectPublishedCommand request, CancellationToken cancellationToken)
    {
        var project = await context.Projects.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Project), request.Id);

        if (request.IsPublished) project.Publish();
        else project.Unpublish();

        await context.SaveChangesAsync(cancellationToken);
    }
}
