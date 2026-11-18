// Menguji CRUD papan dan, yang terpenting, kepemilikan data.

using System.Net;
using System.Net.Http.Json;
using DaffaTodo.Api.Dtos.Boards;
using DaffaTodo.Api.Tests.Infrastructure;

namespace DaffaTodo.Api.Tests;

public class BoardsTests : ApiTestBase, IClassFixture<ApiFactory>
{
    public BoardsTests(ApiFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task Create_AddsThreeDefaultColumns()
    {
        var client = await CreateAuthenticatedClientAsync();

        var board = await CreateBoardAsync(client);

        // Urutan sudah diurutkan oleh backend berdasarkan Position
        var names = board.Columns.Select(c => c.Name).ToList();
        Assert.Equal(new[] { "To Do", "In Progress", "Done" }, names);
    }

    [Fact]
    public async Task GetAll_ReturnsOnlyBoardsOwnedByTheUser()
    {
        var owner = await CreateAuthenticatedClientAsync();
        var stranger = await CreateAuthenticatedClientAsync();
        await CreateBoardAsync(owner, "Owner Board");

        // Pengguna lain mengambil daftar papannya sendiri
        var boards = await stranger.GetFromJsonAsync<List<BoardSummaryResponse>>("/api/boards", Json);

        Assert.Empty(boards!);
    }

    [Fact]
    public async Task GetById_OfAnotherUsersBoard_ReturnsNotFound()
    {
        var owner = await CreateAuthenticatedClientAsync();
        var stranger = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(owner);

        var response = await stranger.GetAsync($"/api/boards/{board.Id}");

        // 404, bukan 403, supaya orang tidak bisa menebak id papan milik pengguna lain
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Update_ChangesTheBoardName()
    {
        var client = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(client, "Old Name");

        var response = await client.PutAsJsonAsync(
            $"/api/boards/{board.Id}", new BoardRequest { Name = "New Name" }, Json);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        var updated = await GetBoardAsync(client, board.Id);
        Assert.Equal("New Name", updated.Name);
    }

    [Fact]
    public async Task Delete_RemovesTheBoard()
    {
        var client = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(client);

        var response = await client.DeleteAsync($"/api/boards/{board.Id}");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        // Setelah dihapus, papan tidak ditemukan lagi
        var afterDelete = await client.GetAsync($"/api/boards/{board.Id}");
        Assert.Equal(HttpStatusCode.NotFound, afterDelete.StatusCode);
    }

    [Fact]
    public async Task Delete_AnotherUsersBoard_ReturnsNotFound()
    {
        var owner = await CreateAuthenticatedClientAsync();
        var stranger = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(owner);

        var response = await stranger.DeleteAsync($"/api/boards/{board.Id}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        // Papan milik pemilik tetap utuh
        var stillThere = await owner.GetAsync($"/api/boards/{board.Id}");
        Assert.Equal(HttpStatusCode.OK, stillThere.StatusCode);
    }
}
