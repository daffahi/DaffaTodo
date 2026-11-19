using System.ComponentModel.DataAnnotations;
using DaffaTodo.Api.Entities;

namespace DaffaTodo.Api.Dtos.Tasks;

public class TaskRequest
{
    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }

    public TaskPriority Priority { get; set; } = TaskPriority.Medium;

    public DateTime? DueDate { get; set; }
}