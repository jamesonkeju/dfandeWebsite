using DFANDE.Application.Common.Interfaces;
using DFANDE.Domain.Constants;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DFANDE.Infrastructure.Identity;

public class IdentityService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    RoleManager<IdentityRole<Guid>> roleManager,
    ILogger<IdentityService> logger)
    : IIdentityService
{
    public async Task<AuthenticatedUser?> ValidateCredentialsAsync(string email, string password)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null || !user.IsActive)
        {
            return null;
        }

        var result = await signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: true);
        if (!result.Succeeded)
        {
            return null;
        }

        var roles = await userManager.GetRolesAsync(user);
        return new AuthenticatedUser(user.Id, user.Email!, user.DisplayName, roles);
    }

    public async Task<AuthenticatedUser?> GetUserByIdAsync(Guid userId)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            return null;
        }

        var roles = await userManager.GetRolesAsync(user);
        return new AuthenticatedUser(user.Id, user.Email!, user.DisplayName, roles);
    }

    public async Task<List<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default)
    {
        var users = await userManager.Users.AsNoTracking().ToListAsync(cancellationToken);
        var list = new List<UserDto>();

        foreach (var u in users)
        {
            var roles = await userManager.GetRolesAsync(u);
            list.Add(new UserDto(
                u.Id,
                u.Email ?? string.Empty,
                u.DisplayName ?? string.Empty,
                roles,
                u.IsActive,
                u.LockoutEnabled,
                u.LockoutEnd,
                u.CreatedAtUtc));
        }

        return list.OrderByDescending(u => u.CreatedAtUtc).ToList();
    }

    public async Task<IdentityOperationResult> CreateUserAsync(string email, string displayName, string role, string initialPassword)
    {
        var existing = await userManager.FindByEmailAsync(email);
        if (existing is not null)
        {
            return new IdentityOperationResult(false, "A user with this email address already exists.");
        }

        if (!Roles.All.Contains(role))
        {
            return new IdentityOperationResult(false, $"Invalid role '{role}'. Allowed roles: {string.Join(", ", Roles.All)}.");
        }

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            DisplayName = displayName,
            EmailConfirmed = true,
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow,
        };

        var result = await userManager.CreateAsync(user, initialPassword);
        if (!result.Succeeded)
        {
            return new IdentityOperationResult(false, string.Join("; ", result.Errors.Select(e => e.Description)));
        }

        await userManager.AddToRoleAsync(user, role);
        return new IdentityOperationResult(true);
    }

    public async Task<IdentityOperationResult> UpdateUserAsync(Guid userId, string displayName, string role)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            return new IdentityOperationResult(false, "User not found.");
        }

        user.DisplayName = displayName;
        var updateRes = await userManager.UpdateAsync(user);
        if (!updateRes.Succeeded)
        {
            return new IdentityOperationResult(false, string.Join("; ", updateRes.Errors.Select(e => e.Description)));
        }

        if (Roles.All.Contains(role))
        {
            var currentRoles = await userManager.GetRolesAsync(user);
            if (!currentRoles.Contains(role))
            {
                await userManager.RemoveFromRolesAsync(user, currentRoles);
                await userManager.AddToRoleAsync(user, role);
            }
        }

        return new IdentityOperationResult(true);
    }

    public async Task<IdentityOperationResult> ToggleUserStatusAsync(Guid userId, bool isActive)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            return new IdentityOperationResult(false, "User not found.");
        }

        user.IsActive = isActive;
        var result = await userManager.UpdateAsync(user);
        return result.Succeeded
            ? new IdentityOperationResult(true)
            : new IdentityOperationResult(false, string.Join("; ", result.Errors.Select(e => e.Description)));
    }

    public async Task<IdentityOperationResult> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            return new IdentityOperationResult(false, "User not found.");
        }

        var result = await userManager.ChangePasswordAsync(user, currentPassword, newPassword);
        return result.Succeeded
            ? new IdentityOperationResult(true)
            : new IdentityOperationResult(false, string.Join("; ", result.Errors.Select(e => e.Description)));
    }

    public async Task<string?> GeneratePasswordResetTokenAsync(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null || !user.IsActive)
        {
            return null;
        }

        return await userManager.GeneratePasswordResetTokenAsync(user);
    }

    public async Task<IdentityOperationResult> ResetPasswordWithTokenAsync(string email, string token, string newPassword)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null || !user.IsActive)
        {
            return new IdentityOperationResult(false, "User not found or account is deactivated.");
        }

        var result = await userManager.ResetPasswordAsync(user, token, newPassword);
        return result.Succeeded
            ? new IdentityOperationResult(true)
            : new IdentityOperationResult(false, string.Join("; ", result.Errors.Select(e => e.Description)));
    }

    public async Task<IdentityOperationResult> AdminResetPasswordAsync(Guid userId, string newPassword)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            return new IdentityOperationResult(false, "User not found.");
        }

        var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
        var result = await userManager.ResetPasswordAsync(user, resetToken, newPassword);
        return result.Succeeded
            ? new IdentityOperationResult(true)
            : new IdentityOperationResult(false, string.Join("; ", result.Errors.Select(e => e.Description)));
    }
}
