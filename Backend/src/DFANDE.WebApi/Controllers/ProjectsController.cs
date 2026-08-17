using DFANDE.Application.Features.Projects;
using DFANDE.Application.Features.Projects.Commands.CreateProject;
using DFANDE.Application.Features.Projects.Commands.DeleteProject;
using DFANDE.Application.Features.Projects.Commands.SetProjectPublished;
using DFANDE.Application.Features.Projects.Commands.UpdateProject;
using DFANDE.Application.Features.Projects.Queries.GetAllProjects;
using DFANDE.Application.Features.Projects.Queries.GetPublishedProjects;
using DFANDE.Domain.Constants;
using DFANDE.WebApi.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DFANDE.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController(ISender sender) : ControllerBase
{
    /// <summary>Public — the /projects page and the homepage's featured section.</summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ProjectDto>>>> GetPublished(CancellationToken cancellationToken)
    {
        var projects = await sender.Send(new GetPublishedProjectsQuery(), cancellationToken);
        return Ok(ApiResponse<List<ProjectDto>>.Ok(projects));
    }

    /// <summary>CMS-only — every project, published or not.</summary>
    [HttpGet("all")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator},{Roles.Editor}")]
    public async Task<ActionResult<ApiResponse<List<ProjectDto>>>> GetAll(CancellationToken cancellationToken)
    {
        var projects = await sender.Send(new GetAllProjectsQuery(), cancellationToken);
        return Ok(ApiResponse<List<ProjectDto>>.Ok(projects));
    }

    [HttpPost]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator},{Roles.Editor}")]
    public async Task<ActionResult<ApiResponse<object>>> Create(CreateProjectCommand command, CancellationToken cancellationToken)
    {
        var id = await sender.Send(command, cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { id }, "Project created."));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator},{Roles.Editor}")]
    public async Task<ActionResult<ApiResponse<object>>> Update(Guid id, UpdateProjectRequest request, CancellationToken cancellationToken)
    {
        await sender.Send(
            new UpdateProjectCommand(
                id, request.Client, request.Scope, request.Location, request.Year, request.Category, request.ImageUrl,
                request.DisplayOrder, request.IsFeatured),
            cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { id }, "Project updated."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteProjectCommand(id), cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { id }, "Project deleted."));
    }

    [HttpPatch("{id:guid}/publish")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator}")]
    public async Task<ActionResult<ApiResponse<object>>> SetPublished(Guid id, SetPublishedRequest request, CancellationToken cancellationToken)
    {
        await sender.Send(new SetProjectPublishedCommand(id, request.IsPublished), cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { id, request.IsPublished }));
    }
}

public record UpdateProjectRequest(
    string Client,
    string Scope,
    string Location,
    string Year,
    string Category,
    string? ImageUrl,
    int DisplayOrder,
    bool IsFeatured);

// SetPublishedRequest is declared once in ServicesController.cs and reused
// here — all controllers share the DFANDE.WebApi.Controllers namespace.
