using DaffaTodo.Api.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DaffaTodo.Api.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    // Constructor: menerima pengaturan (misalnya connection string) dari Program.cs lalu meneruskannya ke class induk
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // Tiap DbSet = satu tabel yang didaftarkan ke EF Core. Nama properti menjadi nama tabel
    public DbSet<Board> Boards => Set<Board>();
    public DbSet<BoardColumn> BoardColumns => Set<BoardColumn>();
    public DbSet<TaskItem> TaskItems => Set<TaskItem>();

    // Tempat mengatur detail tabel (panjang maksimal, wajib diisi, dll.)
    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Wajib dipanggil paling awal supaya tabel bawaan Identity tetap dibuat
        base.OnModelCreating(builder);

        builder.Entity<Board>(entity =>
        {
            // IsRequired = kolom wajib diisi (NOT NULL), HasMaxLength = batas panjang teks
            entity.Property(b => b.Name).IsRequired().HasMaxLength(100);
            entity.Property(b => b.Description).HasMaxLength(500);
        });

        builder.Entity<BoardColumn>(entity =>
        {
            entity.Property(c => c.Name).IsRequired().HasMaxLength(50);
        });

        builder.Entity<TaskItem>(entity =>
        {
            entity.Property(t => t.Title).IsRequired().HasMaxLength(150);
            entity.Property(t => t.Description).HasMaxLength(2000);
        });
    }
}