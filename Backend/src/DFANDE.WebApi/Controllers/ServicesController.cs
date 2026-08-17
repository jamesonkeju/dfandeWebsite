using DFANDE.Application.Features.Services;
using DFANDE.Application.Features.Services.Commands.CreateService;
using DFANDE.Application.Features.Services.Commands.DeleteService;
using DFANDE.Application.Features.Services.Commands.SetServicePublished;
using DFANDE.Application.Features.Services.Commands.UpdateService;
using DFANDE.Application.Features.Services.Queries.GetAllServices;
using DFANDE.Application.Features.Services.Queries.GetPublishedServices;
using DFANDE.Application.Features.Services.Queries.GetServiceBySlug;
using DFANDE.Domain.Constants;
using DFANDE.WebApi.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DFANDE.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController(ISender sender) : ControllerBase
{
    /// <summary>Public — what the homepage and public /services page render.</summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ServiceDto>>>> GetPublished(CancellationToken cancellationToken)
    {
        var services = await sender.Send(new GetPublishedServicesQuery(), cancellationToken);
        return Ok(ApiResponse<List<ServiceDto>>.Ok(services));
    }

    /// <summary>CMS-only — every service, published or not.</summary>
    [HttpGet("all")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator},{Roles.Editor}")]
    public async Task<ActionResult<ApiResponse<List<ServiceDto>>>> GetAll(CancellationToken cancellationToken)
    {
        var services = await sender.Send(new GetAllServicesQuery(), cancellationToken);
        return Ok(ApiResponse<List<ServiceDto>>.Ok(services));
    }

    /// <summary>Public — a single published service by its slug.</summary>
    [HttpGet("{slug}")]
    public async Task<ActionResult<ApiResponse<ServiceDto>>> GetBySlug(string slug, CancellationToken cancellationToken)
    {
        var service = await sender.Send(new GetServiceBySlugQuery(slug), cancellationToken);
        if (service is null)
        {
            return NotFound(ApiErrorResponse.Fail($"No published service found with slug '{slug}'."));
        }
        return Ok(ApiResponse<ServiceDto>.Ok(service));
    }

    [HttpPost]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator},{Roles.Editor}")]
    public async Task<ActionResult<ApiResponse<object>>> Create(CreateServiceCommand command, CancellationToken cancellationToken)
    {
        var id = await sender.Send(command, cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { id }, "Service created."));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator},{Roles.Editor}")]
    public async Task<ActionResult<ApiResponse<object>>> Update(Guid id, UpdateServiceRequest request, CancellationToken cancellationToken)
    {
        await sender.Send(
            new UpdateServiceCommand(
                id, request.Title, request.Slug, request.Summary, request.Scope,
                request.Icon, request.ImageUrl, request.DisplayOrder, request.IsFeatured),
            cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { id }, "Service updated."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteServiceCommand(id), cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { id }, "Service deleted."));
    }

    [HttpPatch("{id:guid}/publish")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator}")]
    public async Task<ActionResult<ApiResponse<object>>> SetPublished(Guid id, SetPublishedRequest request, CancellationToken cancellationToken)
    {
        await sender.Send(new SetServicePublishedCommand(id, request.IsPublished), cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { id, request.IsPublished }));
    }
}

public record UpdateServiceRequest(
    string Title,
    string Slug,
    string Summary,
    List<string> Scope,
    string Icon,
    string? ImageUrl,
    int DisplayOrder,
    bool IsFeatured);

public record SetPublishedRequest(bool IsPublished);
