// Data yang dikirim client saat menambah kolom baru.

using System.ComponentModel.DataAnnotations;

namespace DaffaTodo.Api.Dtos.Columns;

public class ColumnRequest
{
    // Batas 50 disamakan dengan aturan di AppDbContext
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
}