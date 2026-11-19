using Microsoft.AspNetCore.Identity;

namespace DaffaTodo.Api.Entities;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;

    public ICollection<Board> Boards { get; set; } = new List<Board>();
}   