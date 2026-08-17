using DFANDE.Application.Common.Interfaces;
using DFANDE.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Products.Commands.CreateProduct;

public record CreateProductCommand(
    string Title,
    string Slug,
    List<string> Items,
    string? Application,
    string? ImageUrl,
    int DisplayOrder,
    bool IsPublished) : IRequest<Guid>;

public class CreateProductCommandHandler(IApplicationDbContext context) : IRequestHandler<CreateProductCommand, Guid>
{
    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        if (await context.Products.AnyAsync(p => p.Slug == request.Slug, cancellationToken))
        {
            throw new Common.Exceptions.ValidationException([
                new FluentValidation.Results.ValidationFailure(nameof(request.Slug), "A product with this slug already exists."),
            ]);
        }

        var product = Product.Create(
            request.Title, request.Slug, request.Items, request.Application, request.ImageUrl,
            request.DisplayOrder, request.IsPublished);

        context.Products.Add(product);
        await context.SaveChangesAsync(cancellationToken);

        return product.Id;
    }
}
