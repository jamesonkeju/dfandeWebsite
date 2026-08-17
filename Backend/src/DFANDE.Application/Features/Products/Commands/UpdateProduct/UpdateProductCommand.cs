using DFANDE.Application.Common.Exceptions;
using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Products.Commands.UpdateProduct;

public record UpdateProductCommand(
    Guid Id,
    string Title,
    string Slug,
    List<string> Items,
    string? Application,
    string? ImageUrl,
    int DisplayOrder) : IRequest;

public class UpdateProductCommandHandler(IApplicationDbContext context) : IRequestHandler<UpdateProductCommand>
{
    public async Task Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Product), request.Id);

        var slugTaken = await context.Products
            .AnyAsync(p => p.Slug == request.Slug && p.Id != request.Id, cancellationToken);
        if (slugTaken)
        {
            throw new Common.Exceptions.ValidationException([
                new FluentValidation.Results.ValidationFailure(nameof(request.Slug), "A product with this slug already exists."),
            ]);
        }

        product.Update(request.Title, request.Slug, request.Items, request.Application, request.ImageUrl, request.DisplayOrder);

        await context.SaveChangesAsync(cancellationToken);
    }
}
