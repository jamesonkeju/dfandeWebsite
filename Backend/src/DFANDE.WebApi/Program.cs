using System.Text;
using System.Text.Json.Serialization;
using DFANDE.Application;
using DFANDE.Infrastructure;
using DFANDE.Infrastructure.Identity;
using DFANDE.WebApi.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, configuration) =>
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext());

builder.Services.AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "DFANDE API",
        Version = "v1",
        Description = "Public website + CMS backend for Divine Flame and Energy International Limited.",
    });

    var bearerScheme = new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Paste the JWT returned from POST /api/auth/login.",
    };
    options.AddSecurityDefinition("Bearer", bearerScheme);
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        { new Microsoft.OpenApi.Models.OpenApiSecurityScheme { Reference = new Microsoft.OpenApi.Models.OpenApiReference { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" } }, [] },
    });
});

builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
});

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});
builder.Services.AddMemoryCache();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var jwtSettings = builder.Configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>()
    ?? throw new InvalidOperationException("Jwt configuration section is missing.");

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
            RoleClaimType = System.Security.Claims.ClaimTypes.Role,
            NameClaimType = "displayName",
        };
    });

builder.Services.AddAuthorization();

const string FrontendCorsPolicy = "FrontendCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];

        policy.WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

// Enterprise Security Headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "SAMEORIGIN");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    await next();
});

app.UseResponseCompression();

var swaggerEnabled = builder.Configuration.GetValue<bool>("Swagger:Enabled", app.Environment.IsDevelopment());
if (swaggerEnabled)
{
    var swaggerRequireAuth = builder.Configuration.GetValue<bool>("Swagger:RequireAuth", false);
    if (swaggerRequireAuth)
    {
        app.UseWhen(context => context.Request.Path.StartsWithSegments("/swagger"), swaggerApp =>
        {
            swaggerApp.UseAuthentication();
            swaggerApp.UseAuthorization();
        });
    }

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "DFANDE API v1");
        c.RoutePrefix = "swagger";
    });
}

// Auto-ensure schema objects and essential tables exist
using (var scope = app.Services.CreateScope())
{
    try
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<DFANDE.Infrastructure.Persistence.ApplicationDbContext>();
        await dbContext.Database.EnsureCreatedAsync();

        await dbContext.Database.ExecuteSqlRawAsync(@"
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'AspNetUsers')
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('AspNetUsers') AND name = 'IsActive')
    BEGIN
        ALTER TABLE [AspNetUsers] ADD [IsActive] BIT NOT NULL DEFAULT 1;
    END
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('AspNetUsers') AND name = 'CreatedAtUtc')
    BEGIN
        ALTER TABLE [AspNetUsers] ADD [CreatedAtUtc] DATETIME2 NOT NULL DEFAULT GETUTCDATE();
    END
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AuditLogs')
BEGIN
    CREATE TABLE [AuditLogs] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [UserId] UNIQUEIDENTIFIER NULL,
        [UserEmail] NVARCHAR(256) NOT NULL,
        [UserDisplayName] NVARCHAR(256) NOT NULL,
        [Action] NVARCHAR(128) NOT NULL,
        [EntityName] NVARCHAR(128) NOT NULL,
        [EntityId] NVARCHAR(256) NULL,
        [DetailsJson] NVARCHAR(MAX) NULL,
        [IpAddress] NVARCHAR(64) NULL,
        [TimestampUtc] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [CreatedAt] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        [CreatedBy] NVARCHAR(MAX) NULL,
        [UpdatedAt] DATETIMEOFFSET NULL,
        [UpdatedBy] NVARCHAR(MAX) NULL
    );
END
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'VisitorLogs')
BEGIN
    CREATE TABLE [VisitorLogs] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [SessionId] NVARCHAR(128) NOT NULL,
        [Path] NVARCHAR(512) NOT NULL,
        [QueryString] NVARCHAR(1024) NULL,
        [Referrer] NVARCHAR(1024) NULL,
        [UserAgent] NVARCHAR(1024) NULL,
        [Browser] NVARCHAR(128) NOT NULL DEFAULT 'Unknown',
        [OperatingSystem] NVARCHAR(128) NOT NULL DEFAULT 'Unknown',
        [DeviceType] NVARCHAR(64) NOT NULL DEFAULT 'Desktop',
        [IpHash] NVARCHAR(128) NULL,
        [Country] NVARCHAR(128) NULL,
        [City] NVARCHAR(128) NULL,
        [DurationSeconds] INT NOT NULL DEFAULT 0,
        [TimestampUtc] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [CreatedAt] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        [CreatedBy] NVARCHAR(MAX) NULL,
        [UpdatedAt] DATETIMEOFFSET NULL,
        [UpdatedBy] NVARCHAR(MAX) NULL
    );
    CREATE INDEX [IX_VisitorLogs_TimestampUtc] ON [VisitorLogs] ([TimestampUtc]);
    CREATE INDEX [IX_VisitorLogs_Path] ON [VisitorLogs] ([Path]);
    CREATE INDEX [IX_VisitorLogs_SessionId] ON [VisitorLogs] ([SessionId]);
END");

        await IdentitySeeder.SeedAsync(scope.ServiceProvider, app.Configuration);

        if (app.Environment.IsDevelopment())
        {
            var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
            await DFANDE.Infrastructure.Persistence.ServiceSeeder.SeedAsync(dbContext, loggerFactory);
            await DFANDE.Infrastructure.Persistence.ProductSeeder.SeedAsync(dbContext, loggerFactory);
            await DFANDE.Infrastructure.Persistence.ProjectSeeder.SeedAsync(dbContext, loggerFactory);
            await DFANDE.Infrastructure.Persistence.ContentBlockSeeder.SeedAsync(dbContext, loggerFactory);
        }
    }
    catch { /* Schema check for SQL Server vs Postgres */ }
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors(FrontendCorsPolicy);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

// Exposed for WebApplicationFactory in the integration test project.
public partial class Program;
