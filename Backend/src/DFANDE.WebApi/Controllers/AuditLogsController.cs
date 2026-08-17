using DFANDE.Application.Features.AuditLogs.Queries.GetAuditLogs;
using DFANDE.Domain.Constants;
using DFANDE.WebApi.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DFANDE.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Roles.SuperAdmin)]
public class AuditLogsController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<AuditLogListResult>>> GetAuditLogs(
        [FromQuery] string? action,
        [FromQuery] string? entityName,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        var result = await sender.Send(
            new GetAuditLogsQuery(action, entityName, search, page, pageSize),
            cancellationToken);

        return Ok(ApiResponse<AuditLogListResult>.Ok(result));
    }
}
