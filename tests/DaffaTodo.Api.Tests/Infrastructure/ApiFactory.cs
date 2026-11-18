// Pabrik yang membuat salinan API khusus test.
// Bedanya dengan API asli hanya dua: database diganti SQLite in-memory,
// dan kunci JWT diisi dari kode (User Secrets tidak ada di komputer lain atau di CI).

using DaffaTodo.Api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace DaffaTodo.Api.Tests.Infrastructure;

// WebApplicationFactory<Program> = menjalankan seluruh aplikasi API di dalam proses test
public class ApiFactory : WebApplicationFactory<Program>
{
    // Database in-memory SQLite hidup selama koneksinya terbuka.
    // Koneksi ini dibuka sekali dan dipegang, supaya semua request di test memakai database yang sama
    private readonly SqliteConnection _connection = new("DataSource=:memory:");

    public ApiFactory()
    {
        // Kunci JWT untuk test. Program.cs membacanya saat startup, dan variabel environment
        // adalah cara yang pasti terbaca pada saat itu. "__" dibaca sebagai ":" (Jwt:Key)
        Environment.SetEnvironmentVariable("Jwt__Key", "kunci-rahasia-khusus-test-minimal-32-karakter");

        _connection.Open();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // ConfigureTestServices dijalankan SETELAH pendaftaran service di Program.cs,
        // jadi di sini kita bisa mengganti service yang sudah terdaftar
        builder.ConfigureTestServices(services =>
        {
            // Buang pendaftaran AppDbContext yang memakai SQL Server. AddDbContext mendaftarkan beberapa
            // service generik yang membawa AppDbContext. Semuanya harus dibuang, kalau tidak EF Core
            // mengeluh ada dua provider database (SQL Server dan SQLite) yang terdaftar
            var descriptors = services
                .Where(d => d.ServiceType.IsGenericType
                    && d.ServiceType.GenericTypeArguments.Contains(typeof(AppDbContext)))
                .ToList();

            foreach (var descriptor in descriptors)
            {
                services.Remove(descriptor);
            }

            // Daftarkan lagi AppDbContext, kali ini memakai SQLite in-memory
            services.AddDbContext<AppDbContext>(options => options.UseSqlite(_connection));
        });
    }

    // Dipanggil saat aplikasi test selesai dibangun: di sinilah tabel-tabelnya dibuat
    protected override IHost CreateHost(IHostBuilder builder)
    {
        var host = base.CreateHost(builder);

        using var scope = host.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // EnsureCreated membuat tabel langsung dari Entities (tanpa Migrations)
        context.Database.EnsureCreated();

        return host;
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);

        if (disposing)
        {
            // Menutup koneksi = database in-memory ikut lenyap
            _connection.Dispose();
        }
    }
}
