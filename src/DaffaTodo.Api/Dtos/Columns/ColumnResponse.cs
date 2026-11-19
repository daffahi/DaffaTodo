using DaffaTodo.Api.Dtos.Tasks;

namespace DaffaTodo.Api.Dtos.Columns;

public class ColumnResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Position { get; set; }
    public List<TaskResponse> Tasks { get; set; } = new List<TaskResponse>();
}