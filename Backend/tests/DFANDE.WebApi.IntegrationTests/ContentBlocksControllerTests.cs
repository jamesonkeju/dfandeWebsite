using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using DFANDE.Domain.Entities;
using DFANDE.Domain.Enums;
using DFANDE.Infrastructure.Persistence;
using DFANDE.WebApi.Controllers;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace DFANDE.WebApi.IntegrationTests;

[Collection("Integration Tests")]
public class ContentBlocksControllerTests
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public ContentBlocksControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Update_sanitizes_a_script_payload_out_of_a_RichText_block()
    {
        var key = $"test.xss.{Guid.NewGuid():N}";
        await SeedRichTextBlockAsync(key, "test");

        var token = await LoginAsAdminAsync();

        var payload = new
        {
            blocks = new[]
            {
                new
                {
                    key,
                    textValue = "<p>Safe text</p><script>alert('xss')</script><img src=x onerror=alert(1)>",
                },
            },
        };

        using var request = new HttpRequestMessage(HttpMethod.Put, "/api/contentblocks/test")
        {
            Content = JsonContent.Create(payload),
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        var updated = body.GetProperty("data").EnumerateArray().Single(b => b.GetProperty("key").GetString() == key);
        var stored = updated.GetProperty("textValue").GetString();

        stored.Should().Contain("Safe text");
        stored.Should().NotContain("<script");
        stored.Should().NotContain("onerror");
    }

    [Fact]
    public async Task Update_rejects_an_unknown_key()
    {
        var token = await LoginAsAdminAsync();

        var payload = new { blocks = new[] { new { key = "no.such.key", textValue = "x" } } };

        using var request = new HttpRequestMessage(HttpMethod.Put, "/api/contentblocks/test")
        {
            Content = JsonContent.Create(payload),
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetAll_is_public_and_returns_seeded_blocks()
    {
        var key = $"test.public.{Guid.NewGuid():N}";
        await SeedRichTextBlockAsync(key, "test");

        var response = await _client.GetAsync("/api/contentblocks");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        body.GetProperty("data").EnumerateArray().Should().Contain(b => b.GetProperty("key").GetString() == key);
    }

    private async Task SeedRichTextBlockAsync(string key, string pageGroup)
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        db.ContentBlocks.Add(ContentBlock.CreateText(key, pageGroup, ContentValueType.RichText, "initial", "Test block", null, 0));
        await db.SaveChangesAsync();
    }

    private async Task<string> LoginAsAdminAsync()
    {
        var loginResponse = await _client.PostAsJsonAsync(
            "/api/auth/login",
            new LoginRequest(CustomWebApplicationFactory.AdminEmail, CustomWebApplicationFactory.AdminPassword));
        var loginBody = await loginResponse.Content.ReadFromJsonAsync<JsonElement>();
        return loginBody.GetProperty("data").GetProperty("token").GetString()!;
    }
}
