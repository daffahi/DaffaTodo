using DaffaTodo.Api.Dtos.Columns;

namespace DaffaTodo.Api.Dtos.Boards;

public class BoardDetailResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ColumnResponse> Columns { get; set; } = new List<ColumnResponse>();
}