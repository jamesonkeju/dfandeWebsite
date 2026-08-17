using DFANDE.Domain.Constants;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace DFANDE.Infrastructure.Identity;

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

        var defaultUsers = new[]
        {
            new
            {
                Email = configuration["SeedAdmin:Email"] ?? "admin@dfande.local",
                Password = configuration["SeedAdmin:Password"] ?? "AdminPassword123!",
                DisplayName = configuration["SeedAdmin:DisplayName"] ?? "Super Admin",
                Role = Roles.SuperAdmin
            },
            new
            {
                Email = "editor@dfande.local",
                Password = "EditorPassword123!",
                DisplayName = "Content Operations Lead",
                Role = Roles.ContentManager
            },
            new
            {
                Email = "viewer@dfande.local",
                Password = "ViewerPassword123!",
                DisplayName = "Inquiry & Commercial Desk",
                Role = Roles.InquiryViewer
            }
        };

        foreach (var userDef in defaultUsers)
        {
            var existingUser = await userManager.FindByEmailAsync(userDef.Email);
            if (existingUser is null)
            {
                var user = new ApplicationUser
                {
                    UserName = userDef.Email,
                    Email = userDef.Email,
                    DisplayName = userDef.DisplayName,
                    EmailConfirmed = true,
                };

                var result = await userManager.CreateAsync(user, userDef.Password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, userDef.Role);
                    logger.LogInformation("Seeded demo user {Email} with role {Role}", userDef.Email, userDef.Role);
                }
                else
                {
                    logger.LogError("Failed to seed user {Email}: {Errors}", userDef.Email, string.Join("; ", result.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                // Ensure existing user has role assigned
                if (!await userManager.IsInRoleAsync(existingUser, userDef.Role))
                {
                    await userManager.AddToRoleAsync(existingUser, userDef.Role);
                }
            }
        }
    }
}
