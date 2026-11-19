using System.ComponentModel.DataAnnotations;

namespace DaffaTodo.Api.Dtos.Boards;

public class BoardRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }
}