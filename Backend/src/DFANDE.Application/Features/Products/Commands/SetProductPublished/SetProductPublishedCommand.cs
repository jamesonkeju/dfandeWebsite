using DFANDE.Application.Common.Exceptions;
using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Products.Commands.SetProductPublished;

public record SetProductPublishedCommand(Guid Id, bool IsPublished) : IRequest;

public class SetProductPublishedCommandHandler(IApplicationDbContext context)
    : IRequestHandler<SetProductPublishedCommand>
{
    public async Task Handle(SetProductPublishedCommand request, CancellationToken cancellationToken)
    {
        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Product), request.Id);

        if (request.IsPublished) product.Publish();
        else product.Unpublish();

        await context.SaveChangesAsync(cancellationToken);
    }
}
