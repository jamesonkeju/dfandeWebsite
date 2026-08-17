using DFANDE.Application.Common.Interfaces;
using DFANDE.Domain.Constants;
using DFANDE.WebApi.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DFANDE.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Roles.SuperAdmin)]
public class UsersController(
    IIdentityService identityService,
    IAuditLogService auditLogService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<UserDto>>>> GetUsers(CancellationToken cancellationToken)
    {
        var users = await identityService.GetAllUsersAsync(cancellationToken);
        return Ok(ApiResponse<List<UserDto>>.Ok(users));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<object>>> CreateUser([FromBody] CreateUserRequest request, CancellationToken cancellationToken)
    {
        var result = await identityService.CreateUserAsync(request.Email, request.DisplayName, request.Role, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(ApiErrorResponse.Fail(result.ErrorMessage ?? "Failed to create user."));
        }

        await auditLogService.LogAsync(
            action: "CREATE_USER",
            entityName: "ApplicationUser",
            entityId: request.Email,
            details: new { request.Email, request.DisplayName, request.Role },
            cancellationToken: cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { message = "User created successfully." }));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateUser(Guid id, [FromBody] UpdateUserRequest request, CancellationToken cancellationToken)
    {
        var result = await identityService.UpdateUserAsync(id, request.DisplayName, request.Role);
        if (!result.Succeeded)
        {
            return BadRequest(ApiErrorResponse.Fail(result.ErrorMessage ?? "Failed to update user."));
        }

        await auditLogService.LogAsync(
            action: "UPDATE_USER",
            entityName: "ApplicationUser",
            entityId: id.ToString(),
            details: new { request.DisplayName, request.Role },
            cancellationToken: cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { message = "User updated successfully." }));
    }

    [HttpPatch("{id:guid}/toggle-status")]
    public async Task<ActionResult<ApiResponse<object>>> ToggleStatus(Guid id, [FromBody] ToggleStatusRequest request, CancellationToken cancellationToken)
    {
        var result = await identityService.ToggleUserStatusAsync(id, request.IsActive);
        if (!result.Succeeded)
        {
            return BadRequest(ApiErrorResponse.Fail(result.ErrorMessage ?? "Failed to update user status."));
        }

        await auditLogService.LogAsync(
            action: request.IsActive ? "ACTIVATE_USER" : "DEACTIVATE_USER",
            entityName: "ApplicationUser",
            entityId: id.ToString(),
            details: new { request.IsActive },
            cancellationToken: cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { message = $"User status updated to {(request.IsActive ? "Active" : "Deactivated")}." }));
    }

    [HttpPost("{id:guid}/admin-reset-password")]
    public async Task<ActionResult<ApiResponse<object>>> AdminResetPassword(Guid id, [FromBody] AdminResetPasswordRequest request, CancellationToken cancellationToken)
    {
        var result = await identityService.AdminResetPasswordAsync(id, request.NewPassword);
        if (!result.Succeeded)
        {
            return BadRequest(ApiErrorResponse.Fail(result.ErrorMessage ?? "Failed to reset password."));
        }

        await auditLogService.LogAsync(
            action: "ADMIN_RESET_PASSWORD",
            entityName: "ApplicationUser",
            entityId: id.ToString(),
            details: new { UserId = id },
            cancellationToken: cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { message = "Password reset successfully." }));
    }
}

public record CreateUserRequest(string Email, string DisplayName, string Role, string Password);
public record UpdateUserRequest(string DisplayName, string Role);
public record ToggleStatusRequest(bool IsActive);
public record AdminResetPasswordRequest(string NewPassword);
