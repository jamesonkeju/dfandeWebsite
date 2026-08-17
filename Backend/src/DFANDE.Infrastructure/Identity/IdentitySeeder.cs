using DFANDE.Domain.Constants;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace DFANDE.Infrastructure.Identity;

/// <summary>
/// Development-only: ensures the three CMS roles exist and seeds one
/// Super Admin so there's a way to log in before a real onboarding flow
/// exists. Never runs outside Development — production user creation is a
/// deliberate, separate concern.
/// </summary>
public static class IdentitySeeder
{
    public static async Task SeedAsync(IServiceProvider services, IConfiguration configuration)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger("IdentitySeeder");

        foreach (var role in Roles.All)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
        }

        var email = configuration["SeedAdmin:Email"];
        var password = configuration["SeedAdmin:Password"];
        var displayName = configuration["SeedAdmin:DisplayName"] ?? "Super Admin";

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            logger.LogWarning("SeedAdmin:Email/Password not configured — skipping dev admin seed.");
            return;
        }

        if (await userManager.FindByEmailAsync(email) is not null)
        {
            return;
        }

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            DisplayName = displayName,
            EmailConfirmed = true,
        };

        var result = await userManager.CreateAsync(user, password);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, Roles.SuperAdmin);
            logger.LogInformation("Seeded dev Super Admin user {Email}", email);
        }
        else
        {
            logger.LogError(
                "Failed to seed dev Super Admin: {Errors}",
                string.Join("; ", result.Errors.Select(e => e.Description)));
        }
    }
}
