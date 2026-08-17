using DFANDE.Application.Common.Exceptions;
using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Products.Commands.DeleteProduct;

public record DeleteProductCommand(Guid Id) : IRequest;

public class DeleteProductCommandHandler(IApplicationDbContext context) : IRequestHandler<DeleteProductCommand>
{
    public async Task Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Product), request.Id);

        context.Products.Remove(product);
        await context.SaveChangesAsync(cancellationToken);
    }
}
