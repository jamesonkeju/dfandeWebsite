using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using DFANDE.WebApi.Controllers;
using FluentAssertions;
using Xunit;

namespace DFANDE.WebApi.IntegrationTests;

[Collection("Integration Tests")]
public class ContactControllerTests
{
    private readonly HttpClient _client;

    public ContactControllerTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Submit_with_valid_data_returns_200_and_an_id()
    {
        var request = new CreateContactSubmissionRequest(
            Name: "Integration Test",
            Email: "integration@example.com",
            Subject: "Test subject",
            Message: "Test message body.",
            Phone: null,
            ServiceOfInterest: "Choke Valve Services");

        var response = await _client.PostAsJsonAsync("/api/contact", request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        body.GetProperty("success").GetBoolean().Should().BeTrue();
    }

    [Fact]
    public async Task Submit_with_invalid_email_returns_400_with_field_errors()
    {
        var request = new CreateContactSubmissionRequest(
            Name: "Integration Test",
            Email: "not-an-email",
            Subject: "Test subject",
            Message: "Test message body.",
            Phone: null,
            ServiceOfInterest: null);

        var response = await _client.PostAsJsonAsync("/api/contact", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        body.GetProperty("success").GetBoolean().Should().BeFalse();
        body.GetProperty("errors").TryGetProperty("Email", out _).Should().BeTrue();
    }

    [Fact]
    public async Task Submitted_entries_appear_in_GetAll()
    {
        var uniqueSubject = $"Round-trip test {Guid.NewGuid()}";
        var request = new CreateContactSubmissionRequest(
            Name: "Round Trip",
            Email: "roundtrip@example.com",
            Subject: uniqueSubject,
            Message: "Verifying the read side sees what the write side persisted.",
            Phone: null,
            ServiceOfInterest: null);

        await _client.PostAsJsonAsync("/api/contact", request);

        // GetAll is Administrator/SuperAdmin-only (see AuthControllerTests for
        // the authorization rules themselves) — authenticate to reach it.
        var loginResponse = await _client.PostAsJsonAsync(
            "/api/auth/login",
            new LoginRequest(CustomWebApplicationFactory.AdminEmail, CustomWebApplicationFactory.AdminPassword));
        var loginBody = await loginResponse.Content.ReadFromJsonAsync<JsonElement>();
        var token = loginBody.GetProperty("data").GetProperty("token").GetString();

        using var getRequest = new HttpRequestMessage(HttpMethod.Get, "/api/contact");
        getRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(getRequest);
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        var submissions = body.GetProperty("data").EnumerateArray();
        submissions.Should().Contain(s => s.GetProperty("subject").GetString() == uniqueSubject);
    }

    [Fact]
    public async Task UpdateStatus_accepts_a_string_status_and_persists_it()
    {
        // Regression test: the enum used to only bind from a JSON number
        // (System.Text.Json's default), which would have 400'd the exact
        // { "status": "Read" } payload the real frontend sends. Sending the
        // literal string here is the point of the test.
        var createRequest = new CreateContactSubmissionRequest(
            Name: "Status Test",
            Email: "status-test@example.com",
            Subject: $"Status test {Guid.NewGuid()}",
            Message: "Verifying string-enum status updates work end to end.",
            Phone: null,
            ServiceOfInterest: null);

        var createResponse = await _client.PostAsJsonAsync("/api/contact", createRequest);
        var createBody = await createResponse.Content.ReadFromJsonAsync<JsonElement>();
        var id = createBody.GetProperty("data").GetProperty("id").GetString();

        var token = await LoginAsAdminAsync();

        using var patchRequest = new HttpRequestMessage(HttpMethod.Patch, $"/api/contact/{id}/status")
        {
            Content = JsonContent.Create(new { status = "Read" }),
        };
        patchRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var patchResponse = await _client.SendAsync(patchRequest);
        patchResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        using var getRequest = new HttpRequestMessage(HttpMethod.Get, "/api/contact");
        getRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var getResponse = await _client.SendAsync(getRequest);
        var getBody = await getResponse.Content.ReadFromJsonAsync<JsonElement>();

        var updated = getBody.GetProperty("data").EnumerateArray()
            .Single(s => s.GetProperty("id").GetString() == id);
        updated.GetProperty("status").GetString().Should().Be("Read");
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
