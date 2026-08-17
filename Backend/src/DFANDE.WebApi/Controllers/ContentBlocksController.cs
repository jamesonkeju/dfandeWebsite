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
public class ContentBlocksController(ISender sender) : ControllerBase
{
    /// <summary>
    /// Public — every content block, flat. No draft/publish split for site
    /// copy, so this one endpoint serves both the public site and the
    /// admin content editor.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ContentBlockDto>>>> GetAll(CancellationToken cancellationToken)
    {
        var blocks = await sender.Send(new GetContentBlocksQuery(), cancellationToken);
        return Ok(ApiResponse<List<ContentBlockDto>>.Ok(blocks));
    }

    [HttpPut("{pageGroup}")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.Administrator},{Roles.Editor}")]
    public async Task<ActionResult<ApiResponse<List<ContentBlockDto>>>> UpdatePageGroup(
        string pageGroup, UpdateContentBlocksRequest request, CancellationToken cancellationToken)
    {
        var blocks = await sender.Send(new UpdateContentBlocksCommand(pageGroup, request.Blocks), cancellationToken);
        return Ok(ApiResponse<List<ContentBlockDto>>.Ok(blocks, "Content updated."));
    }
}

public record UpdateContentBlocksRequest(List<ContentBlockUpdateItem> Blocks);
