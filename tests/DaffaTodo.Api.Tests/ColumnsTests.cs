// Menguji tambah, ganti nama, dan hapus kolom, termasuk penomoran ulang dan hapus-berantai.

using System.Net;
using System.Net.Http.Json;
using DaffaTodo.Api.Dtos.Columns;
using DaffaTodo.Api.Tests.Infrastructure;

namespace DaffaTodo.Api.Tests;

public class ColumnsTests : ApiTestBase, IClassFixture<ApiFactory>
{
    public ColumnsTests(ApiFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task Create_AddsTheColumnAtTheEnd()
    {
        var client = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(client);

        var response = await client.PostAsJsonAsync(
            $"/api/boards/{board.Id}/columns", new ColumnRequest { Name = "Review" }, Json);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        // Papan sudah punya kolom 0, 1, 2, jadi kolom baru mendapat posisi 3
        var column = await response.Content.ReadFromJsonAsync<ColumnResponse>(Json);
        Assert.Equal(3, column!.Position);
    }

    [Fact]
    public async Task Rename_ChangesTheColumnName()
    {
        var client = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(client);
        var column = board.Columns[0];

        var response = await client.PutAsJsonAsync(
            $"/api/columns/{column.Id}", new ColumnRequest { Name = "Backlog" }, Json);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        var updated = await GetBoardAsync(client, board.Id);
        Assert.Equal("Backlog", updated.Columns[0].Name);
    }

    [Fact]
    public async Task Delete_RenumbersTheRemainingColumns()
    {
        var client = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(client);

        // Hapus kolom tengah (In Progress)
        var response = await client.DeleteAsync($"/api/columns/{board.Columns[1].Id}");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        var updated = await GetBoardAsync(client, board.Id);

        // Sisanya To Do dan Done, bernomor 0 dan 1 tanpa celah
        Assert.Equal(new[] { "To Do", "Done" }, updated.Columns.Select(c => c.Name).ToList());
        Assert.Equal(new[] { 0, 1 }, updated.Columns.Select(c => c.Position).ToList());
    }

    [Fact]
    public async Task Delete_AlsoRemovesTheTasksInsideTheColumn()
    {
        var client = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(client);
        var column = board.Columns[0];
        var task = await CreateTaskAsync(client, column.Id, "Will be deleted");

        await client.DeleteAsync($"/api/columns/{column.Id}");

        // Tugasnya ikut hilang (cascade delete), jadi menghapusnya lagi menghasilkan 404
        var response = await client.DeleteAsync($"/api/tasks/{task.Id}");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Delete_AnotherUsersColumn_ReturnsNotFound()
    {
        var owner = await CreateAuthenticatedClientAsync();
        var stranger = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(owner);

        var response = await stranger.DeleteAsync($"/api/columns/{board.Columns[0].Id}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
