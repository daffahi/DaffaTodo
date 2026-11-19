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

    [HttpPost("columns/{columnId:int}/tasks")]
    public async Task<IActionResult> Create(int columnId, TaskRequest request)
    {
        var task = await _taskService.CreateAsync(columnId, UserId, request);

        return task is null
            ? NotFound()
            : StatusCode(StatusCodes.Status201Created, task);
    }

    [HttpPut("tasks/{id:int}")]
    public async Task<IActionResult> Update(int id, TaskRequest request)
    {
        var updated = await _taskService.UpdateAsync(id, UserId, request);
        return updated ? NoContent() : NotFound();
    }

    [HttpPatch("tasks/{id:int}/move")]
    public async Task<IActionResult> Move(int id, MoveTaskRequest request)
    {
        var moved = await _taskService.MoveAsync(id, UserId, request);
        return moved ? NoContent() : NotFound();
    }

    [HttpDelete("tasks/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _taskService.DeleteAsync(id, UserId);
        return deleted ? NoContent() : NotFound();
    }
}