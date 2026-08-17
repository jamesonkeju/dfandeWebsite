using DFANDE.Application.Common.Exceptions;
using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Services.Commands.SetServicePublished;

public record SetServicePublishedCommand(Guid Id, bool IsPublished) : IRequest;

public class SetServicePublishedCommandHandler(IApplicationDbContext context)
    : IRequestHandler<SetServicePublishedCommand>
{
    public async Task Handle(SetServicePublishedCommand request, CancellationToken cancellationToken)
    {
        var service = await context.Services.FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Service), request.Id);

        if (request.IsPublished) service.Publish();
        else service.Unpublish();

        await context.SaveChangesAsync(cancellationToken);
    }
}
