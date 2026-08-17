namespace DFANDE.Application.Common.Interfaces;

public record AuthenticatedUser(Guid Id, string Email, string DisplayName, IList<string> Roles);

public record UserDto(
    Guid Id,
    string Email,
    string DisplayName,
    IList<string> Roles,
    bool IsActive,
    bool LockoutEnabled,
    DateTimeOffset? LockoutEnd,
    DateTime CreatedAtUtc);

public record IdentityOperationResult(bool Succeeded, string? ErrorMessage = null);

public interface IIdentityService
{
    Task<AuthenticatedUser?> ValidateCredentialsAsync(string email, string password);
    Task<AuthenticatedUser?> GetUserByIdAsync(Guid userId);
    Task<List<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default);
    Task<IdentityOperationResult> CreateUserAsync(string email, string displayName, string role, string initialPassword);
    Task<IdentityOperationResult> UpdateUserAsync(Guid userId, string displayName, string role);
    Task<IdentityOperationResult> ToggleUserStatusAsync(Guid userId, bool isActive);
    Task<IdentityOperationResult> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword);
    Task<string?> GeneratePasswordResetTokenAsync(string email);
    Task<IdentityOperationResult> ResetPasswordWithTokenAsync(string email, string token, string newPassword);
    Task<IdentityOperationResult> AdminResetPasswordAsync(Guid userId, string newPassword);
}
