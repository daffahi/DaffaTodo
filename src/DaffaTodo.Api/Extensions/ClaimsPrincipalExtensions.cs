using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace DaffaTodo.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string GetUserId(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(JwtRegisteredClaimNames.Sub)!;
    }
}