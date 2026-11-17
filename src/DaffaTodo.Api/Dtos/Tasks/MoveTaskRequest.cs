// Data untuk memindahkan tugas: mau pindah ke kolom mana, dan di urutan ke berapa.

using System.ComponentModel.DataAnnotations;

namespace DaffaTodo.Api.Dtos.Tasks;

public class MoveTaskRequest
{
    // Kolom tujuan (boleh sama dengan kolom asal kalau hanya menggeser urutan)
    public int BoardColumnId { get; set; }

    // Urutan di kolom tujuan, dimulai dari 0
    [Range(0, int.MaxValue)]
    public int Position { get; set; }
}