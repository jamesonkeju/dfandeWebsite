using DFANDE.Application.Common.Interfaces;
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
public class ProjectsController(ISender sender, IAuditLogService auditLogService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ProjectDto>>>> GetPublished(CancellationToken cancellationToken)
    {
        var projects = await sender.Send(new GetPublishedProjectsQuery(), cancellationToken);
        return Ok(ApiResponse<List<ProjectDto>>.Ok(projects));
    }

    [HttpGet("all")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.ContentManager},{Roles.InquiryViewer}")]
    public async Task<ActionResult<ApiResponse<List<ProjectDto>>>> GetAll(CancellationToken cancellationToken)
    {
        var projects = await sender.Send(new GetAllProjectsQuery(), cancellationToken);
        return Ok(ApiResponse<List<ProjectDto>>.Ok(projects));
    }

    [HttpPost]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.ContentManager}")]
    public async Task<ActionResult<ApiResponse<object>>> Create(CreateProjectCommand command, CancellationToken cancellationToken)
    {
        var id = await sender.Send(command, cancellationToken);
        await auditLogService.LogAsync(
            action: "CREATE_PROJECT",
            entityName: "Project",
            entityId: id.ToString(),
            details: new { command.Client, command.Scope, command.Category },
            cancellationToken: cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { id }, "Project created."));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.ContentManager}")]
    public async Task<ActionResult<ApiResponse<object>>> Update(Guid id, UpdateProjectRequest request, CancellationToken cancellationToken)
    {
        await sender.Send(
            new UpdateProjectCommand(
                id, request.Client, request.Scope, request.Location, request.Year, request.Category, request.ImageUrl,
                request.DisplayOrder, request.IsFeatured),
            cancellationToken);

        await auditLogService.LogAsync(
            action: "UPDATE_PROJECT",
            entityName: "Project",
            entityId: id.ToString(),
            details: new { request.Client, request.Scope },
            cancellationToken: cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { id }, "Project updated."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.SuperAdmin)]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteProjectCommand(id), cancellationToken);
        await auditLogService.LogAsync(
            action: "DELETE_PROJECT",
            entityName: "Project",
            entityId: id.ToString(),
            cancellationToken: cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { id }, "Project deleted."));
    }

    [HttpPatch("{id:guid}/publish")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.ContentManager}")]
    public async Task<ActionResult<ApiResponse<object>>> SetPublished(Guid id, SetPublishedRequest request, CancellationToken cancellationToken)
    {
        await sender.Send(new SetProjectPublishedCommand(id, request.IsPublished), cancellationToken);
        await auditLogService.LogAsync(
            action: request.IsPublished ? "PUBLISH_PROJECT" : "UNPUBLISH_PROJECT",
            entityName: "Project",
            entityId: id.ToString(),
            details: new { request.IsPublished },
            cancellationToken: cancellationToken);

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
