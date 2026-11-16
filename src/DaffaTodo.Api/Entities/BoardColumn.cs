namespace DaffaTodo.Api.Entities;

public class BoardColumn
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    // Urutan kolom di papan (0, 1, 2, ...). Supaya urutan tetap sama setelah halaman di-refresh
    public int Position { get; set; }

    // Foreign key: kolom ini milik papan yang mana
    public int BoardId { get; set; }
    public Board Board { get; set; } = null!;

    // Satu kolom punya banyak tugas
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}