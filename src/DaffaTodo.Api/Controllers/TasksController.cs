// Pintu masuk HTTP untuk tugas.

using DaffaTodo.Api.Dtos.Tasks;
using DaffaTodo.Api.Extensions;
using DaffaTodo.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DaffaTodo.Api.Controllers;

[Authorize]
[ApiController]
[Route("api")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    private string UserId => User.GetUserId();

    // POST /api/columns/3/tasks
    [HttpPost("columns/{columnId:int}/tasks")]
    public async Task<IActionResult> Create(int columnId, TaskRequest request)
    {
        var task = await _taskService.CreateAsync(columnId, UserId, request);

        return task is null
            ? NotFound()
            : StatusCode(StatusCodes.Status201Created, task);
    }

    // PUT /api/tasks/10
    [HttpPut("tasks/{id:int}")]
    public async Task<IActionResult> Update(int id, TaskRequest request)
    {
        var updated = await _taskService.UpdateAsync(id, UserId, request);
        return updated ? NoContent() : NotFound();
    }

    // PATCH /api/tasks/10/move
    // PATCH dipakai karena hanya sebagian data tugas yang berubah (kolom dan posisi)
    [HttpPatch("tasks/{id:int}/move")]
    public async Task<IActionResult> Move(int id, MoveTaskRequest request)
    {
        var moved = await _taskService.MoveAsync(id, UserId, request);
        return moved ? NoContent() : NotFound();
    }

    // DELETE /api/tasks/10
    [HttpDelete("tasks/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _taskService.DeleteAsync(id, UserId);
        return deleted ? NoContent() : NotFound();
    }
}