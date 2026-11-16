// Pintu masuk HTTP untuk register dan login. Controller hanya menerima request, memanggil Identity dan service, lalu membalas.

using DaffaTodo.Api.Dtos.Auth;
using DaffaTodo.Api.Entities;
using DaffaTodo.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DaffaTodo.Api.Controllers;

// [ApiController] = aktifkan validasi otomatis dan perilaku khusus API
// [Route] = alamat dasar controller ini: /api/auth
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    // UserManager = alat bawaan Identity untuk membuat user dan memeriksa password
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;

    public AuthController(UserManager<ApplicationUser> userManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    // POST /api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = request.FullName
        };

        // CreateAsync menyimpan user ke database, password di-hash otomatis oleh Identity
        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            // Contoh gagal: email sudah terdaftar, password terlalu lemah
            return BadRequest(result.Errors.Select(e => e.Description));
        }

        return Ok(new AuthResponse
        {
            Token = _tokenService.CreateToken(user),
            Email = user.Email,
            FullName = user.FullName
        });
    }

    // POST /api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        // Pesan error sengaja dibuat sama untuk "email tidak ada" dan "password salah",
        // supaya orang tidak bisa menebak email mana yang terdaftar
        if (user is null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        return Ok(new AuthResponse
        {
            Token = _tokenService.CreateToken(user),
            Email = user.Email!,
            FullName = user.FullName
        });
    }
}