using DFANDE.Application.Common.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace DFANDE.Infrastructure.Identity;

public class IdentityService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
    : IIdentityService
{
    public async Task<AuthenticatedUser?> ValidateCredentialsAsync(string email, string password)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
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
}
