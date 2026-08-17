using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using DFANDE.WebApi.Controllers;
using FluentAssertions;
using Xunit;

namespace DFANDE.WebApi.IntegrationTests;

[Collection("Integration Tests")]
public class AuthControllerTests
{
    private readonly HttpClient _client;

    public AuthControllerTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Login_with_correct_credentials_returns_a_token_and_roles()
    {
        var response = await _client.PostAsJsonAsync(
            "/api/auth/login",
            new LoginRequest(CustomWebApplicationFactory.AdminEmail, CustomWebApplicationFactory.AdminPassword));

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        body.GetProperty("success").GetBoolean().Should().BeTrue();
        body.GetProperty("data").GetProperty("token").GetString().Should().NotBeNullOrWhiteSpace();
        body.GetProperty("data").GetProperty("roles")[0].GetString().Should().Be("SuperAdmin");
    }

    [Fact]
    public async Task Login_with_wrong_password_returns_401()
    {
        var response = await _client.PostAsJsonAsync(
            "/api/auth/login",
            new LoginRequest(CustomWebApplicationFactory.AdminEmail, "WrongPassword"));

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Login_with_unknown_email_returns_401()
    {
        var response = await _client.PostAsJsonAsync(
            "/api/auth/login",
            new LoginRequest("nobody@dfande.local", "WhateverPassword1"));

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetContactSubmissions_without_a_token_returns_401()
    {
        var response = await _client.GetAsync("/api/contact");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetContactSubmissions_with_editor_token_returns_403()
    {
        var token = await LoginAndGetToken(CustomWebApplicationFactory.EditorEmail, CustomWebApplicationFactory.EditorPassword);

        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/contact");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task GetContactSubmissions_with_admin_token_returns_200()
    {
        var token = await LoginAndGetToken(CustomWebApplicationFactory.AdminEmail, CustomWebApplicationFactory.AdminPassword);

        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/contact");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.SendAsync(request);
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    private async Task<string> LoginAndGetToken(string email, string password)
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest(email, password));
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        return body.GetProperty("data").GetProperty("token").GetString()!;
    }
}
