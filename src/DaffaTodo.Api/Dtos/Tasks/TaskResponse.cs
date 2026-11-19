using DaffaTodo.Api.Entities;

namespace DaffaTodo.Api.Dtos.Tasks;

public class TaskResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskPriority Priority { get; set; }
    public DateTime? DueDate { get; set; }
    public int Position { get; set; }
}