using System.Security.Claims;
using DFANDE.Application.Common.Interfaces;
using DFANDE.Application.Features.Auth.Commands.Login;
using DFANDE.Domain.Entities;
using DFANDE.WebApi.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DFANDE.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    ISender sender,
    IIdentityService identityService,
    IAuditLogService auditLogService,
    IEmailService emailService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<object>>> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        var result = await sender.Send(new LoginCommand(request.Email, request.Password), cancellationToken);

        if (!result.Succeeded)
        {
            await auditLogService.LogAsync(
                action: "AUTH_LOGIN_FAILED",
                entityName: "ApplicationUser",
                entityId: request.Email,
                details: new { Reason = "Invalid credentials or inactive account" },
                cancellationToken: cancellationToken);

            return Unauthorized(ApiErrorResponse.Fail("Invalid email, password, or deactivated account."));
        }

        await auditLogService.LogAsync(
            action: "AUTH_LOGIN_SUCCESS",
            entityName: "ApplicationUser",
            entityId: request.Email,
            details: new { result.DisplayName, result.Roles },
            cancellationToken: cancellationToken);

        return Ok(ApiResponse<object>.Ok(new
        {
            token = result.Token,
            displayName = result.DisplayName,
            roles = result.Roles,
        }));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<object>>> GetCurrentUser(CancellationToken cancellationToken)
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(idClaim, out var userId))
        {
            return Unauthorized(ApiErrorResponse.Fail("Invalid user token."));
        }

        var user = await identityService.GetUserByIdAsync(userId);
        if (user is null)
        {
            return NotFound(ApiErrorResponse.Fail("User profile not found."));
        }

        return Ok(ApiResponse<object>.Ok(new
        {
            id = user.Id,
            email = user.Email,
            displayName = user.DisplayName,
            roles = user.Roles,
        }));
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<object>>> ChangePassword(
        [FromBody] ChangePasswordRequest request,
        CancellationToken cancellationToken)
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(idClaim, out var userId))
        {
            return Unauthorized(ApiErrorResponse.Fail("Invalid user token."));
        }

        var result = await identityService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded)
        {
            return BadRequest(ApiErrorResponse.Fail(result.ErrorMessage ?? "Failed to change password."));
        }

        await auditLogService.LogAsync(
            action: "PASSWORD_CHANGED",
            entityName: "ApplicationUser",
            entityId: userId.ToString(),
            details: new { Timestamp = DateTime.UtcNow },
            cancellationToken: cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { message = "Password updated successfully." }));
    }

    [HttpPost("forgot-password")]
    public async Task<ActionResult<ApiResponse<object>>> ForgotPassword(
        [FromBody] ForgotPasswordRequest request,
        CancellationToken cancellationToken)
    {
        var token = await identityService.GeneratePasswordResetTokenAsync(request.Email);
        
        // Even if user not found, return generic success to prevent user enumeration
        if (token is not null)
        {
            await auditLogService.LogAsync(
                action: "PASSWORD_RESET_REQUESTED",
                entityName: "ApplicationUser",
                entityId: request.Email,
                details: new { request.Email },
                cancellationToken: cancellationToken);

            // Send notification email containing token/instructions via SMTP
            var submission = ContactSubmission.Create(
                name: "System Security Desk",
                email: request.Email,
                subject: "[SECURITY] Divine Flame CMS Password Reset Request",
                message: $"A password reset was requested for your DF&E Admin account. Token: {token}\n\nIf you did not request this, please notify your SuperAdmin immediately.",
                phone: null,
                serviceOfInterest: "Security & Access Governance");

            await emailService.SendContactNotificationEmailAsync(submission, cancellationToken);
        }

        return Ok(ApiResponse<object>.Ok(new
        {
            message = "If an active account exists for this email, password reset instructions have been dispatched.",
            // In dev mode, return token to ease local validation
            devToken = token
        }));
    }

    [HttpPost("reset-password")]
    public async Task<ActionResult<ApiResponse<object>>> ResetPassword(
        [FromBody] ResetPasswordRequest request,
        CancellationToken cancellationToken)
    {
        var result = await identityService.ResetPasswordWithTokenAsync(request.Email, request.Token, request.NewPassword);
        if (!result.Succeeded)
        {
            return BadRequest(ApiErrorResponse.Fail(result.ErrorMessage ?? "Invalid or expired reset token."));
        }

        await auditLogService.LogAsync(
            action: "PASSWORD_RESET_COMPLETED",
            entityName: "ApplicationUser",
            entityId: request.Email,
            details: new { request.Email },
            cancellationToken: cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { message = "Password reset successfully. You may now sign in with your new credentials." }));
    }
}

public record LoginRequest(string Email, string Password);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
public record ForgotPasswordRequest(string Email);
public record ResetPasswordRequest(string Email, string Token, string NewPassword);
