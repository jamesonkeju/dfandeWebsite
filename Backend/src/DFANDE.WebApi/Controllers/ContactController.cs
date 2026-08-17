using DFANDE.Application.Common.Interfaces;
using DFANDE.Application.Features.Contact.Commands.CreateContactSubmission;
using DFANDE.Application.Features.Contact.Commands.UpdateContactSubmissionStatus;
using DFANDE.Application.Features.Contact.Queries.GetContactSubmissions;
using DFANDE.Domain.Constants;
using DFANDE.Domain.Enums;
using DFANDE.WebApi.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DFANDE.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController(ISender sender, IAuditLogService auditLogService) : ControllerBase
{
    /// <summary>Public endpoint — anyone can submit the contact form.</summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<object>>> Submit(
        CreateContactSubmissionRequest request,
        CancellationToken cancellationToken)
    {
        var id = await sender.Send(
            new CreateContactSubmissionCommand(
                request.Name,
                request.Email,
                request.Subject,
                request.Message,
                request.Phone,
                request.ServiceOfInterest),
            cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { id }, "Thanks — we've received your message and will be in touch."));
    }

    /// <summary>CMS-only — viewing customer submissions is available to all authenticated admin roles.</summary>
    [HttpGet]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.ContentManager},{Roles.InquiryViewer}")]
    public async Task<ActionResult<ApiResponse<List<ContactSubmissionDto>>>> GetAll(CancellationToken cancellationToken)
    {
        var submissions = await sender.Send(new GetContactSubmissionsQuery(), cancellationToken);
        return Ok(ApiResponse<List<ContactSubmissionDto>>.Ok(submissions));
    }

    /// <summary>CMS-only — mark a submission Read, Responded or Archived.</summary>
    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = $"{Roles.SuperAdmin},{Roles.ContentManager}")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateStatus(
        Guid id,
        UpdateStatusRequest request,
        CancellationToken cancellationToken)
    {
        await sender.Send(new UpdateContactSubmissionStatusCommand(id, request.Status), cancellationToken);

        await auditLogService.LogAsync(
            action: "UPDATE_CONTACT_STATUS",
            entityName: "ContactSubmission",
            entityId: id.ToString(),
            details: new { Status = request.Status.ToString() },
            cancellationToken: cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { id, status = request.Status.ToString() }));
    }
}

public record UpdateStatusRequest(ContactSubmissionStatus Status);

public record CreateContactSubmissionRequest(
    string Name,
    string Email,
    string Subject,
    string Message,
    string? Phone,
    string? ServiceOfInterest);
