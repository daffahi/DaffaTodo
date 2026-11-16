using DaffaTodo.Api.Entities;

namespace DaffaTodo.Api.Services;

public interface ITokenService
{
    // Menerima pengguna, mengembalikan token JWT dalam bentuk string
    string CreateToken(ApplicationUser user);
}