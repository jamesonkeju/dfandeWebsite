using DFANDE.Application.Features.Analytics.Commands.TrackVisit;
using DFANDE.Application.Features.Analytics.Queries.ExportAnalyticsReport;
using DFANDE.Application.Features.Analytics.Queries.GetAnalyticsSummary;
using DFANDE.Domain.Constants;
using DFANDE.WebApi.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DFANDE.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController(ISender sender) : ControllerBase
{
    public record TrackVisitRequest(
        string SessionId,
        string Path,
        string? QueryString = null,
        string? Referrer = null,
        int DurationSeconds = 0);

    [HttpPost("track")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<Guid>>> TrackVisit(
        [FromBody] TrackVisitRequest request,
        CancellationToken cancellationToken)
    {
        var userAgent = Request.Headers.UserAgent.ToString();
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();

        var id = await sender.Send(new TrackVisitCommand(
            SessionId: request.SessionId,
            Path: request.Path,
            QueryString: request.QueryString,
            Referrer: request.Referrer,
            UserAgent: userAgent,
            IpAddress: ip,
            DurationSeconds: request.DurationSeconds), cancellationToken);

        return Ok(ApiResponse<Guid>.Ok(id, "Visit tracked successfully."));
    }

    [HttpGet("summary")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.ContentManager},{Roles.InquiryViewer}")]
    public async Task<ActionResult<ApiResponse<AnalyticsSummaryDto>>> GetSummary(
        [FromQuery] int days = 30,
        CancellationToken cancellationToken = default)
    {
        var result = await sender.Send(new GetAnalyticsSummaryQuery(days), cancellationToken);
        return Ok(ApiResponse<AnalyticsSummaryDto>.Ok(result));
    }

    [HttpGet("export")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.ContentManager}")]
    public async Task<IActionResult> ExportReport(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        CancellationToken cancellationToken = default)
    {
        var result = await sender.Send(new ExportAnalyticsReportQuery(from, to), cancellationToken);
        return File(result.FileBytes, result.ContentType, result.FileName);
    }
}
