// Class pengguna. Mewarisi IdentityUser, sehingga otomatis punya Id, UserName, Email, PasswordHash, dll. Kita hanya menambah yang kita perlukan.

using Microsoft.AspNetCore.Identity;

namespace DaffaTodo.Api.Entities;

// ": IdentityUser" artinya class ini mewarisi semua kolom bawaan Identity (Id, Email, PasswordHash, dst.)
// Class ini akan menjadi tabel AspNetUsers
public class ApplicationUser : IdentityUser
{
    // Kolom tambahan milik kita: nama lengkap. string.Empty supaya nilai awalnya tidak null
    public string FullName { get; set; } = string.Empty;

    // Navigasi: satu pengguna punya banyak papan. Ini bukan kolom, hanya jalan pintas di C#
    // untuk mengakses semua papan milik pengguna ini
    public ICollection<Board> Boards { get; set; } = new List<Board>();
}   