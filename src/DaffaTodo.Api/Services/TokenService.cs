// Isi sebenarnya dari kontrak tadi: membuat JWT.

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DaffaTodo.Api.Entities;
using Microsoft.IdentityModel.Tokens;

namespace DaffaTodo.Api.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    // IConfiguration disuntik otomatis oleh ASP.NET Core (Dependency Injection),
    // dipakai untuk membaca appsettings.json dan User Secrets
    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string CreateToken(ApplicationUser user)
    {
        // Claim = data yang "ditempel" di dalam token (siapa pemiliknya)
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!)
        };

        // Kunci rahasia dari User Secrets, dipakai untuk menandatangani token
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiresInMinutes = int.Parse(_configuration["Jwt:ExpiresInMinutes"]!);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
            signingCredentials: credentials);

        // Ubah objek token menjadi string yang siap dikirim ke client
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}