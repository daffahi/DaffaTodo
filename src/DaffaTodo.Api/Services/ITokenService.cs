// Folder Services berisi logika aplikasi di luar controller. Controller tugasnya menerima request dan membalas, pekerjaan sebenarnya ditaruh di service. File ini adalah interface, yaitu “kontrak” yang menyebut apa yang bisa dilakukan service tanpa menyebut caranya.

using DaffaTodo.Api.Entities;

namespace DaffaTodo.Api.Services;

public interface ITokenService
{
    // Menerima pengguna, mengembalikan token JWT dalam bentuk string
    string CreateToken(ApplicationUser user);
}