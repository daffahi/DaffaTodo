// Kartu tugas. Tabel TaskItems. Namanya bukan Task karena bentrok dengan class Task bawaan .NET. (Seharusnya namanya: Items)

namespace DaffaTodo.Api.Entities;

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Prioritas memakai enum, default Medium
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;

    // "DateTime?" artinya tenggat boleh tidak diisi
    public DateTime? DueDate { get; set; }

    // Urutan kartu di dalam kolomnya
    public int Position { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key: tugas ini ada di kolom yang mana
    public int BoardColumnId { get; set; }
    public BoardColumn BoardColumn { get; set; } = null!;
}