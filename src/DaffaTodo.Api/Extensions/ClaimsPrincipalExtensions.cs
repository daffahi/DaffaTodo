// Folder Extensions berisi method tambahan untuk class yang sudah ada. Sekarang ada tiga controller yang butuh id pengguna dari token, jadi cara mengambilnya dipindah ke satu tempat daripada disalin tiga kali.

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace DaffaTodo.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    // "this ClaimsPrincipal user" membuat method ini bisa dipanggil seperti bawaan: User.GetUserId()
    public static string GetUserId(this ClaimsPrincipal user)
    {
        // Id pengguna disimpan di claim "sub" saat token dibuat (TokenService)
        return user.FindFirstValue(JwtRegisteredClaimNames.Sub)!;
    }
}