using System.ComponentModel.DataAnnotations;

namespace DaffaTodo.Api.Dtos.Tasks;

public class MoveTaskRequest
{
    public int BoardColumnId { get; set; }

    [Range(0, int.MaxValue)]
    public int Position { get; set; }
}