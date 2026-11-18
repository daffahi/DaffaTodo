// Berisi test yang paling penting di proyek ini: logika move yang menata ulang urutan.

using System.Net;
using System.Net.Http.Json;
using DaffaTodo.Api.Dtos.Tasks;
using DaffaTodo.Api.Entities;
using DaffaTodo.Api.Tests.Infrastructure;

namespace DaffaTodo.Api.Tests;

public class TasksTests : ApiTestBase, IClassFixture<ApiFactory>
{
    public TasksTests(ApiFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task Create_AppendsTasksToTheBottomOfTheColumn()
    {
        var client = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(client);
        var todo = board.Columns[0];

        var first = await CreateTaskAsync(client, todo.Id, "A");
        var second = await CreateTaskAsync(client, todo.Id, "B");

        Assert.Equal(0, first.Position);
        Assert.Equal(1, second.Position);
    }

    [Fact]
    public async Task Update_ChangesTheTaskFields()
    {
        var client = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(client);
        var task = await CreateTaskAsync(client, board.Columns[0].Id, "Old title");

        var request = new TaskRequest
        {
            Title = "New title",
            Description = "Some details",
            Priority = TaskPriority.High
        };
        var response = await client.PutAsJsonAsync($"/api/tasks/{task.Id}", request, Json);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        var updated = (await GetBoardAsync(client, board.Id)).Columns[0].Tasks[0];
        Assert.Equal("New title", updated.Title);
        Assert.Equal("Some details", updated.Description);
        Assert.Equal(TaskPriority.High, updated.Priority);
    }

    [Fact]
    public async Task Move_WithinTheSameColumn_ReordersTheTasks()
    {
        var client = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(client);
        var todo = board.Columns[0];
        await CreateTaskAsync(client, todo.Id, "A");
        await CreateTaskAsync(client, todo.Id, "B");
        var c = await CreateTaskAsync(client, todo.Id, "C");

        // Pindahkan C dari posisi terakhir ke paling atas
        var move = new MoveTaskRequest { BoardColumnId = todo.Id, Position = 0 };
        var response = await client.PatchAsJsonAsync($"/api/tasks/{c.Id}/move", move, Json);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        var tasks = (await GetBoardAsync(client, board.Id)).Columns[0].Tasks;
        Assert.Equal(new[] { "C", "A", "B" }, tasks.Select(t => t.Title).ToList());
        // Nomor urutnya rapi 0, 1, 2
        Assert.Equal(new[] { 0, 1, 2 }, tasks.Select(t => t.Position).ToList());
    }

    [Fact]
    public async Task Move_ToAnotherColumn_UpdatesBothColumns()
    {
        var client = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(client);
        var todo = board.Columns[0];
        var progress = board.Columns[1];
        var a = await CreateTaskAsync(client, todo.Id, "A");
        await CreateTaskAsync(client, todo.Id, "B");
        await CreateTaskAsync(client, progress.Id, "C");

        // Pindahkan A dari To Do ke paling atas In Progress
        var move = new MoveTaskRequest { BoardColumnId = progress.Id, Position = 0 };
        var response = await client.PatchAsJsonAsync($"/api/tasks/{a.Id}/move", move, Json);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        var updated = await GetBoardAsync(client, board.Id);

        // Kolom tujuan: A di atas, C bergeser ke bawah
        var progressTasks = updated.Columns[1].Tasks;
        Assert.Equal(new[] { "A", "C" }, progressTasks.Select(t => t.Title).ToList());
        Assert.Equal(new[] { 0, 1 }, progressTasks.Select(t => t.Position).ToList());

        // Kolom asal: tinggal B, dinomori ulang jadi 0 (tidak ada celah)
        var todoTasks = updated.Columns[0].Tasks;
        Assert.Equal(new[] { "B" }, todoTasks.Select(t => t.Title).ToList());
        Assert.Equal(0, todoTasks[0].Position);
    }

    [Fact]
    public async Task Move_ToAColumnOfAnotherUsersBoard_ReturnsNotFound()
    {
        var client = await CreateAuthenticatedClientAsync();
        var stranger = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(client);
        var task = await CreateTaskAsync(client, board.Columns[0].Id, "A");
        var strangerBoard = await CreateBoardAsync(stranger);

        // Mencoba memasukkan tugas ke kolom milik papan orang lain
        var move = new MoveTaskRequest { BoardColumnId = strangerBoard.Columns[0].Id, Position = 0 };
        var response = await client.PatchAsJsonAsync($"/api/tasks/{task.Id}/move", move, Json);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Move_AnotherUsersTask_ReturnsNotFound()
    {
        var owner = await CreateAuthenticatedClientAsync();
        var stranger = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(owner);
        var task = await CreateTaskAsync(owner, board.Columns[0].Id, "A");

        var move = new MoveTaskRequest { BoardColumnId = board.Columns[1].Id, Position = 0 };
        var response = await stranger.PatchAsJsonAsync($"/api/tasks/{task.Id}/move", move, Json);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Delete_AnotherUsersTask_ReturnsNotFound()
    {
        var owner = await CreateAuthenticatedClientAsync();
        var stranger = await CreateAuthenticatedClientAsync();
        var board = await CreateBoardAsync(owner);
        var task = await CreateTaskAsync(owner, board.Columns[0].Id, "A");

        var response = await stranger.DeleteAsync($"/api/tasks/{task.Id}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
