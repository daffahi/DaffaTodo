// Bentuk data papan untuk daftar papan. Isinya ringkas, tanpa kolom dan tugas.

namespace DaffaTodo.Api.Dtos.Boards;

public class BoardSummaryResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
}