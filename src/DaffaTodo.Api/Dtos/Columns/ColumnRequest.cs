using System.ComponentModel.DataAnnotations;

namespace DaffaTodo.Api.Dtos.Columns;

public class ColumnRequest
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
}