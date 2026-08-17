using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Products.Queries.GetPublishedProducts;

/// <summary>Public — what the /products page renders.</summary>
public record GetPublishedProductsQuery : IRequest<List<ProductDto>>;

public class GetPublishedProductsQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetPublishedProductsQuery, List<ProductDto>>
{
    public async Task<List<ProductDto>> Handle(GetPublishedProductsQuery request, CancellationToken cancellationToken)
    {
        return await context.Products
            .Where(p => p.IsPublished)
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new ProductDto(p.Id, p.Title, p.Slug, p.Items, p.Application, p.ImageUrl, p.DisplayOrder, p.IsPublished))
            .ToListAsync(cancellationToken);
    }
}
