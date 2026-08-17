using DFANDE.Domain.Constants;
using DFANDE.Infrastructure.Identity;
using DFANDE.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DFANDE.WebApi.IntegrationTests;

/// <summary>
/// Boots the real WebApi pipeline (real MediatR, real FluentValidation, real
/// EF Core/Npgsql) against a dedicated `dfande_test` database — never the
/// `dfande_dev` database a developer might be looking at locally.
///
/// Seeds its own known test admin/editor accounts directly, rather than
/// relying on the SeedAdmin:* user-secrets a given machine happens to have —
/// tests should pass identically on any machine or CI runner.
/// </summary>
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    public const string AdminEmail = "test-admin@dfande.local";
    public const string AdminPassword = "Test-Only!Passw0rd";
    public const string EditorEmail = "test-editor@dfande.local";
    public const string EditorPassword = "Test-Only!Passw0rd";

    private const string TestConnectionString =
        "Host=localhost;Port=5432;Database=dfande_test;Username=dfande_app;Password=dfande_dev_local_only";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");

        builder.ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = TestConnectionString,
                // Disable Program.cs's own dev seeding for the test host — this
                // factory seeds its own fixed test accounts instead (see below).
                ["SeedAdmin:Email"] = "",
                ["SeedAdmin:Password"] = "",
            });
        });

        builder.ConfigureServices(services =>
        {
            using var provider = services.BuildServiceProvider();
            using var scope = provider.CreateScope();
            var sp = scope.ServiceProvider;

            var db = sp.GetRequiredService<ApplicationDbContext>();
            db.Database.Migrate();

            SeedTestUsersAsync(sp).GetAwaiter().GetResult();
        });
    }

    private static async Task SeedTestUsersAsync(IServiceProvider sp)
    {
        var roleManager = sp.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var userManager = sp.GetRequiredService<UserManager<ApplicationUser>>();

        foreach (var role in Roles.All)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
        }

        await EnsureUserAsync(userManager, AdminEmail, AdminPassword, "Test Admin", Roles.SuperAdmin);
        await EnsureUserAsync(userManager, EditorEmail, EditorPassword, "Test Editor", Roles.Editor);
    }

    private static async Task EnsureUserAsync(
        UserManager<ApplicationUser> userManager, string email, string password, string displayName, string role)
    {
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
            await userManager.AddToRoleAsync(user, role);
        }
    }
}
