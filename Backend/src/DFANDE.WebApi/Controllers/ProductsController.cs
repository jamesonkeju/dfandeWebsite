using DFANDE.Application.Features.Products;
using DFANDE.Application.Features.Products.Commands.CreateProduct;
using DFANDE.Application.Features.Products.Commands.DeleteProduct;
using DFANDE.Application.Features.Products.Commands.SetProductPublished;
using DFANDE.Application.Features.Products.Commands.UpdateProduct;
using DFANDE.Application.Features.Products.Queries.GetAllProducts;
using DFANDE.Application.Features.Products.Queries.GetPublishedProducts;
using DFANDE.Domain.Constants;
using DFANDE.WebApi.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DFANDE.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(ISender sender) : ControllerBase
{
    /// <summary>Public — what the /products page renders.</summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ProductDto>>>> GetPublished(CancellationToken cancellationToken)
    {
        var products = await sender.Send(new GetPublishedProductsQuery(), cancellationToken);
        return Ok(ApiResponse<List<ProductDto>>.Ok(products));
    }

    /// <summary>CMS-only — every product, published or not.</summary>
    [HttpGet("all")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator},{Roles.Editor}")]
    public async Task<ActionResult<ApiResponse<List<ProductDto>>>> GetAll(CancellationToken cancellationToken)
    {
        var products = await sender.Send(new GetAllProductsQuery(), cancellationToken);
        return Ok(ApiResponse<List<ProductDto>>.Ok(products));
    }

    [HttpPost]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator},{Roles.Editor}")]
    public async Task<ActionResult<ApiResponse<object>>> Create(CreateProductCommand command, CancellationToken cancellationToken)
    {
        var id = await sender.Send(command, cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { id }, "Product created."));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator},{Roles.Editor}")]
    public async Task<ActionResult<ApiResponse<object>>> Update(Guid id, UpdateProductRequest request, CancellationToken cancellationToken)
    {
        await sender.Send(
            new UpdateProductCommand(id, request.Title, request.Slug, request.Items, request.Application, request.ImageUrl, request.DisplayOrder),
            cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { id }, "Product updated."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteProductCommand(id), cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { id }, "Product deleted."));
    }

    [HttpPatch("{id:guid}/publish")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator}")]
    public async Task<ActionResult<ApiResponse<object>>> SetPublished(Guid id, SetPublishedRequest request, CancellationToken cancellationToken)
    {
        await sender.Send(new SetProductPublishedCommand(id, request.IsPublished), cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { id, request.IsPublished }));
    }
}

public record UpdateProductRequest(
    string Title,
    string Slug,
    List<string> Items,
    string? Application,
    string? ImageUrl,
    int DisplayOrder);

// SetPublishedRequest is declared once in ServicesController.cs and reused
// here — both controllers share the DFANDE.WebApi.Controllers namespace.
