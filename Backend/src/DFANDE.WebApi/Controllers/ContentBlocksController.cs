using DFANDE.Application.Common.Interfaces;
using DFANDE.Application.Features.ContentBlocks;
using DFANDE.Application.Features.ContentBlocks.Commands.UpdateContentBlocks;
using DFANDE.Application.Features.ContentBlocks.Queries.GetContentBlocks;
using DFANDE.Domain.Constants;
using DFANDE.WebApi.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DFANDE.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContentBlocksController(ISender sender, IAuditLogService auditLogService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ContentBlockDto>>>> GetAll(CancellationToken cancellationToken)
    {
        var blocks = await sender.Send(new GetContentBlocksQuery(), cancellationToken);
        return Ok(ApiResponse<List<ContentBlockDto>>.Ok(blocks));
    }

    [HttpPut("{pageGroup}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.ContentManager}")]
    public async Task<ActionResult<ApiResponse<List<ContentBlockDto>>>> UpdatePageGroup(
        string pageGroup, UpdateContentBlocksRequest request, CancellationToken cancellationToken)
    {
        var blocks = await sender.Send(new UpdateContentBlocksCommand(pageGroup, request.Blocks), cancellationToken);

        await auditLogService.LogAsync(
            action: "UPDATE_CONTENT_BLOCKS",
            entityName: "ContentBlock",
            entityId: pageGroup,
            details: new { PageGroup = pageGroup, Count = request.Blocks.Count },
            cancellationToken: cancellationToken);

        return Ok(ApiResponse<List<ContentBlockDto>>.Ok(blocks, "Content updated."));
    }
}

public record UpdateContentBlocksRequest(List<ContentBlockUpdateItem> Blocks);
