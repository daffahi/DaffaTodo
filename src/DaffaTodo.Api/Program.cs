using System.Text;
using DaffaTodo.Api.Data;
using DaffaTodo.Api.Entities;
using DaffaTodo.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Daftarkan Identity: pakai ApplicationUser, datanya disimpan lewat AppDbContext
builder.Services.AddIdentityCore<ApplicationUser>(options =>
{
    // Aturan password, bisa kamu sesuaikan
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    // Satu email hanya boleh dipakai satu akun
    options.User.RequireUniqueEmail = true;
})
    .AddEntityFrameworkStores<AppDbContext>();

// Daftarkan service buatan kita. Scoped = satu instance baru untuk setiap request
builder.Services.AddScoped<ITokenService, TokenService>();

// Atur cara server memeriksa JWT yang masuk
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Nama claim dibiarkan apa adanya (sub tetap sub), supaya mudah dibaca nanti
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,            // token kedaluwarsa ditolak
            ValidateIssuerSigningKey = true,    // tanda tangan harus cocok dengan kunci kita
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    // Halaman uji endpoint, buka di /scalar/v1
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

// Urutan penting: UseAuthentication (siapa kamu?) harus sebelum UseAuthorization (boleh akses?)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();