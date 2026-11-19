using System.Net;
using System.Net.Http.Json;
using DaffaTodo.Api.Dtos.Auth;
using DaffaTodo.Api.Tests.Infrastructure;

namespace DaffaTodo.Api.Tests;

public class AuthTests : ApiTestBase, IClassFixture<ApiFactory>
{
    public AuthTests(ApiFactory factory) : base(factory)
    {
    }

    private static RegisterRequest NewRegisterRequest(string password = "Test1234") => new()
    {
        FullName = "Test User",
        Email = $"{Guid.NewGuid():N}@example.com",
        Password = password
    };

    [Fact]
    public async Task Register_WithValidData_ReturnsToken()
    {
        var client = CreateClient();
        var request = NewRegisterRequest();

        var response = await client.PostAsJsonAsync("/api/auth/register", request, Json);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var auth = await response.Content.ReadFromJsonAsync<AuthResponse>(Json);
        Assert.False(string.IsNullOrEmpty(auth!.Token));
        Assert.Equal(request.Email, auth.Email);
    }

    [Fact]
    public async Task Register_WithDuplicateEmail_ReturnsBadRequest()
    {
        var client = CreateClient();
        var request = NewRegisterRequest();
        await client.PostAsJsonAsync("/api/auth/register", request, Json);

        var response = await client.PostAsJsonAsync("/api/auth/register", request, Json);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Register_WithWeakPassword_ReturnsBadRequest()
    {
        var client = CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/register", NewRegisterRequest("abc"), Json);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithCorrectPassword_ReturnsToken()
    {
        var client = CreateClient();
        var register = NewRegisterRequest();
        await client.PostAsJsonAsync("/api/auth/register", register, Json);

        var login = new LoginRequest { Email = register.Email, Password = register.Password };
        var response = await client.PostAsJsonAsync("/api/auth/login", login, Json);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var auth = await response.Content.ReadFromJsonAsync<AuthResponse>(Json);
        Assert.False(string.IsNullOrEmpty(auth!.Token));
    }

    [Fact]
    public async Task Login_WithWrongPassword_ReturnsUnauthorized()
    {
        var client = CreateClient();
        var register = NewRegisterRequest();
        await client.PostAsJsonAsync("/api/auth/register", register, Json);

        var login = new LoginRequest { Email = register.Email, Password = "WrongPassword1" };
        var response = await client.PostAsJsonAsync("/api/auth/login", login, Json);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetBoards_WithoutToken_ReturnsUnauthorized()
    {
        var client = CreateClient();

        var response = await client.GetAsync("/api/boards");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
