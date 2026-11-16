// Folder Dtos (Data Transfer Object) berisi bentuk data yang masuk dan keluar lewat API (DTO). Kita tidak mengirim entity langsung ke client, supaya kolom sensitif seperti PasswordHash tidak ikut bocor dan bentuk API bisa berubah tanpa merusak database.

using System.ComponentModel.DataAnnotations;

namespace DaffaTodo.Api.Dtos.Auth;

public class RegisterRequest
{
    // [Required] = wajib diisi, kalau kosong otomatis ditolak dengan 400 Bad Request
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    // [EmailAddress] = format harus seperti email
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}