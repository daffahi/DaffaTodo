// Data yang dikirim client saat membuat atau mengubah papan. Satu class dipakai untuk keduanya karena isinya sama.

using System.ComponentModel.DataAnnotations;

namespace DaffaTodo.Api.Dtos.Boards;

public class BoardRequest
{
    // Batas panjang disamakan dengan aturan di AppDbContext (100 dan 500)
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }
}