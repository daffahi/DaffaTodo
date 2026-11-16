// Papan Kanban. Tabel Boards.

namespace DaffaTodo.Api.Entities;

public class Board
{
    // Primary key: EF Core otomatis menganggap properti bernama "Id" sebagai kunci utama (auto increment)
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    // Tanda "?" artinya boleh kosong (null) di database
    public string? Description { get; set; }

    // Waktu dibuat, diisi otomatis saat objek dibuat. Pakai UTC supaya tidak terpengaruh zona waktu
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key: kolom yang menunjuk ke pemilik papan (tabel AspNetUsers)
    public string OwnerId { get; set; } = string.Empty;

    // Navigasi ke objek pemilik. "null!" artinya: akan diisi EF Core, jangan beri peringatan
    public ApplicationUser Owner { get; set; } = null!;

    // Satu papan punya banyak kolom
    public ICollection<BoardColumn> Columns { get; set; } = new List<BoardColumn>();
}