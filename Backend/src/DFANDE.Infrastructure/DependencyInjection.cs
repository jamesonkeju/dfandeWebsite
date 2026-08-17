using DFANDE.Application.Common.Interfaces;
using DFANDE.Infrastructure.Identity;
using DFANDE.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace DFANDE.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Resolved lazily from DI (not read from `configuration` here) so
        // that test hosts overriding ConnectionStrings:DefaultConnection via
        // ConfigureAppConfiguration actually take effect. Reading it eagerly
        // at registration time captured whatever value was in `configuration`
        // at that instant — before WebApplicationFactory's override could
        // apply — which silently pointed every integration test at
        // dfande_dev instead of the isolated dfande_test database.
        services.AddSingleton(sp =>
        {
            var config = sp.GetRequiredService<IConfiguration>();
            var connectionString = config.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not found.");

            // EnableDynamicJson is required for jsonb columns mapped to arbitrary
            // CLR types (Service.Scope: List<string>) — Npgsql 8 disabled this by
            // default for AOT/trimming safety, so it must be opted into explicitly.
            var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
            dataSourceBuilder.EnableDynamicJson();
            return dataSourceBuilder.Build();
        });

        services.AddDbContext<ApplicationDbContext>((sp, options) =>
            options.UseNpgsql(sp.GetRequiredService<NpgsqlDataSource>()));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        services
            .AddIdentityCore<ApplicationUser>(options =>
            {
                options.Password.RequiredLength = 10;
                options.User.RequireUniqueEmail = true;
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
            })
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddSignInManager();

        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IIdentityService, IdentityService>();

        return services;
    }
}
