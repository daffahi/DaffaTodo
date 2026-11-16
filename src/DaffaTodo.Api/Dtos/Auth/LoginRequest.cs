// Data yang dikirim client saat login.

using System.ComponentModel.DataAnnotations;

namespace DaffaTodo.Api.Dtos.Auth;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}