namespace DaffaTodo.Api.Dtos.Auth;

public class AuthResponse
{
    // Tiket JWT yang akan disimpan client dan dikirim di setiap request berikutnya
    public string Token { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
}