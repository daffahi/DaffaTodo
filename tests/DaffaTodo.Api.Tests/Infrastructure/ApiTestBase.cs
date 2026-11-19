using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using DaffaTodo.Api.Dtos.Auth;
using DaffaTodo.Api.Dtos.Boards;
using DaffaTodo.Api.Dtos.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;

namespace DaffaTodo.Api.Tests.Infrastructure;

public abstract class ApiTestBase
{
    protected static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() }
    };

    private readonly ApiFactory _factory;

    protected ApiTestBase(ApiFactory factory)
    {
        _factory = factory;
    }

    protected HttpClient CreateClient()
    {
        return _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
            AllowAutoRedirect = false
        });
    }

    protected async Task<HttpClient> CreateAuthenticatedClientAsync()
    {
        var client = CreateClient();

        var request = new RegisterRequest
        {
            FullName = "Test User",
            Email = $"{Guid.NewGuid():N}@example.com",
            Password = "Test1234"
        };

        var response = await client.PostAsJsonAsync("/api/auth/register", request, Json);
        response.EnsureSuccessStatusCode();

        var auth = await response.Content.ReadFromJsonAsync<AuthResponse>(Json);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth!.Token);

        return client;
    }

    protected async Task<BoardDetailResponse> CreateBoardAsync(HttpClient client, string name = "Test Board")
    {
        var response = await client.PostAsJsonAsync("/api/boards", new BoardRequest { Name = name }, Json);
        response.EnsureSuccessStatusCode();

        var summary = await response.Content.ReadFromJsonAsync<BoardSummaryResponse>(Json);
        return await GetBoardAsync(client, summary!.Id);
    }

    protected async Task<BoardDetailResponse> GetBoardAsync(HttpClient client, int boardId)
    {
        var board = await client.GetFromJsonAsync<BoardDetailResponse>($"/api/boards/{boardId}", Json);
        return board!;
    }

    protected async Task<TaskResponse> CreateTaskAsync(HttpClient client, int columnId, string title)
    {
        var request = new TaskRequest { Title = title };

        var response = await client.PostAsJsonAsync($"/api/columns/{columnId}/tasks", request, Json);
        response.EnsureSuccessStatusCode();

        return (await response.Content.ReadFromJsonAsync<TaskResponse>(Json))!;
    }
}
