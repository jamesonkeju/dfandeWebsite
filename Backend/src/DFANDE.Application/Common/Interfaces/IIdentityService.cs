namespace DFANDE.Application.Common.Interfaces;

public record AuthenticatedUser(Guid Id, string Email, string DisplayName, IList<string> Roles);

/// <summary>
/// Application-layer abstraction over ASP.NET Core Identity — keeps
/// Identity's concrete types (IdentityUser, UserManager, etc.) confined to
/// Infrastructure.
/// </summary>
public interface IIdentityService
{
    Task<AuthenticatedUser?> ValidateCredentialsAsync(string email, string password);
}
