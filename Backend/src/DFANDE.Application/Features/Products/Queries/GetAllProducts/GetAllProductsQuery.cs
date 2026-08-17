using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Products.Queries.GetAllProducts;

/// <summary>CMS-only — every product regardless of published state.</summary>
public record GetAllProductsQuery : IRequest<List<ProductDto>>;

public class GetAllProductsQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetAllProductsQuery, List<ProductDto>>
{
    public async Task<List<ProductDto>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        return await context.Products
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new ProductDto(p.Id, p.Title, p.Slug, p.Items, p.Application, p.ImageUrl, p.DisplayOrder, p.IsPublished))
            .ToListAsync(cancellationToken);
    }
}
