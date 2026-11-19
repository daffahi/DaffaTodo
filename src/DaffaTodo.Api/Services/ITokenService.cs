using DaffaTodo.Api.Entities;

namespace DaffaTodo.Api.Services;

public interface ITokenService
{
    string CreateToken(ApplicationUser user);
}