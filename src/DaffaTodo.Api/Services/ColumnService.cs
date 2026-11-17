// Menambah kolom baru di urutan paling kanan.

using DaffaTodo.Api.Data;
using DaffaTodo.Api.Dtos.Columns;
using DaffaTodo.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace DaffaTodo.Api.Services;

public class ColumnService : IColumnService
{
    private readonly AppDbContext _context;

    public ColumnService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ColumnResponse?> CreateAsync(int boardId, string userId, ColumnRequest request)
    {
        // Board harus ada dan milik pengguna ini
        var boardExists = await _context.Boards
            .AnyAsync(b => b.Id == boardId && b.OwnerId == userId);

        if (!boardExists)
        {
            return null;
        }

        // Posisi terakhir yang ada + 1. Kalau board belum punya kolom, hasil MaxAsync null, jadi mulai dari -1 + 1 = 0
        var lastPosition = await _context.BoardColumns
            .Where(c => c.BoardId == boardId)
            .MaxAsync(c => (int?)c.Position) ?? -1;

        var column = new BoardColumn
        {
            BoardId = boardId,
            Name = request.Name,
            Position = lastPosition + 1
        };

        _context.BoardColumns.Add(column);
        await _context.SaveChangesAsync();

        return new ColumnResponse
        {
            Id = column.Id,
            Name = column.Name,
            Position = column.Position
        };
    }
}