using DFANDE.Application.Common.Interfaces;
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
public class ProductsController(ISender sender, IAuditLogService auditLogService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ProductDto>>>> GetPublished(CancellationToken cancellationToken)
    {
        var products = await sender.Send(new GetPublishedProductsQuery(), cancellationToken);
        return Ok(ApiResponse<List<ProductDto>>.Ok(products));
    }

    [HttpGet("all")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.ContentManager},{Roles.InquiryViewer}")]
    public async Task<ActionResult<ApiResponse<List<ProductDto>>>> GetAll(CancellationToken cancellationToken)
    {
        var products = await sender.Send(new GetAllProductsQuery(), cancellationToken);
        return Ok(ApiResponse<List<ProductDto>>.Ok(products));
    }

    [HttpPost]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.ContentManager}")]
    public async Task<ActionResult<ApiResponse<object>>> Create(CreateProductCommand command, CancellationToken cancellationToken)
    {
        var id = await sender.Send(command, cancellationToken);
        await auditLogService.LogAsync(
            action: "CREATE_PRODUCT",
            entityName: "Product",
            entityId: id.ToString(),
            details: new { command.Title, command.Slug },
            cancellationToken: cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { id }, "Product created."));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.ContentManager}")]
    public async Task<ActionResult<ApiResponse<object>>> Update(Guid id, UpdateProductRequest request, CancellationToken cancellationToken)
    {
        await sender.Send(
            new UpdateProductCommand(id, request.Title, request.Slug, request.Items, request.Application, request.ImageUrl, request.DisplayOrder),
            cancellationToken);

        await auditLogService.LogAsync(
            action: "UPDATE_PRODUCT",
            entityName: "Product",
            entityId: id.ToString(),
            details: new { request.Title, request.Slug },
            cancellationToken: cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { id }, "Product updated."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.SuperAdmin)]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteProductCommand(id), cancellationToken);
        await auditLogService.LogAsync(
            action: "DELETE_PRODUCT",
            entityName: "Product",
            entityId: id.ToString(),
            cancellationToken: cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { id }, "Product deleted."));
    }

    [HttpPatch("{id:guid}/publish")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.ContentManager}")]
    public async Task<ActionResult<ApiResponse<object>>> SetPublished(Guid id, SetPublishedRequest request, CancellationToken cancellationToken)
    {
        await sender.Send(new SetProductPublishedCommand(id, request.IsPublished), cancellationToken);
        await auditLogService.LogAsync(
            action: request.IsPublished ? "PUBLISH_PRODUCT" : "UNPUBLISH_PRODUCT",
            entityName: "Product",
            entityId: id.ToString(),
            details: new { request.IsPublished },
            cancellationToken: cancellationToken);

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
