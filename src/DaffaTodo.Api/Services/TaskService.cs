using DaffaTodo.Api.Data;
using DaffaTodo.Api.Dtos.Tasks;
using DaffaTodo.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace DaffaTodo.Api.Services;

public class TaskService : ITaskService
{
    private readonly AppDbContext _context;

    public TaskService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TaskResponse?> CreateAsync(int columnId, string userId, TaskRequest request)
    {
        var columnExists = await _context.BoardColumns
            .AnyAsync(c => c.Id == columnId && c.Board.OwnerId == userId);

        if (!columnExists)
        {
            return null;
        }

        var lastPosition = await _context.TaskItems
            .Where(t => t.BoardColumnId == columnId)
            .MaxAsync(t => (int?)t.Position) ?? -1;

        var task = new TaskItem
        {
            BoardColumnId = columnId,
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            DueDate = request.DueDate,
            Position = lastPosition + 1
        };

        _context.TaskItems.Add(task);
        await _context.SaveChangesAsync();

        return ToResponse(task);
    }

    public async Task<bool> UpdateAsync(int id, string userId, TaskRequest request)
    {
        var task = await _context.TaskItems
            .FirstOrDefaultAsync(t => t.Id == id && t.BoardColumn.Board.OwnerId == userId);

        if (task is null)
        {
            return false;
        }

        task.Title = request.Title;
        task.Description = request.Description;
        task.Priority = request.Priority;
        task.DueDate = request.DueDate;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> MoveAsync(int id, string userId, MoveTaskRequest request)
    {
        var task = await _context.TaskItems
            .FirstOrDefaultAsync(t => t.Id == id && t.BoardColumn.Board.OwnerId == userId);

        if (task is null)
        {
            return false;
        }

        var sourceColumnId = task.BoardColumnId;

        var targetColumn = await _context.BoardColumns
            .FirstOrDefaultAsync(c => c.Id == request.BoardColumnId
                && c.Board.OwnerId == userId
                && c.Board.Columns.Any(x => x.Id == sourceColumnId));

        if (targetColumn is null)
        {
            return false;
        }

        var targetTasks = await _context.TaskItems
            .Where(t => t.BoardColumnId == targetColumn.Id && t.Id != task.Id)
            .OrderBy(t => t.Position)
            .ToListAsync();

        var index = Math.Clamp(request.Position, 0, targetTasks.Count);
        targetTasks.Insert(index, task);
        task.BoardColumnId = targetColumn.Id;

        for (var i = 0; i < targetTasks.Count; i++)
        {
            targetTasks[i].Position = i;
        }

        if (sourceColumnId != targetColumn.Id)
        {
            var sourceTasks = await _context.TaskItems
                .Where(t => t.BoardColumnId == sourceColumnId && t.Id != task.Id)
                .OrderBy(t => t.Position)
                .ToListAsync();

            for (var i = 0; i < sourceTasks.Count; i++)
            {
                sourceTasks[i].Position = i;
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var task = await _context.TaskItems
            .FirstOrDefaultAsync(t => t.Id == id && t.BoardColumn.Board.OwnerId == userId);

        if (task is null)
        {
            return false;
        }

        _context.TaskItems.Remove(task);
        await _context.SaveChangesAsync();
        return true;
    }

    private static TaskResponse ToResponse(TaskItem task)
    {
        return new TaskResponse
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Priority = task.Priority,
            DueDate = task.DueDate,
            Position = task.Position
        };
    }
}