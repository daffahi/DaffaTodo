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
        var boardExists = await _context.Boards
            .AnyAsync(b => b.Id == boardId && b.OwnerId == userId);

        if (!boardExists)
        {
            return null;
        }

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

    public async Task<bool> UpdateAsync(int id, string userId, ColumnRequest request)
    {
        var column = await _context.BoardColumns
            .FirstOrDefaultAsync(c => c.Id == id && c.Board.OwnerId == userId);

        if (column is null)
        {
            return false;
        }

        column.Name = request.Name;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var column = await _context.BoardColumns
            .FirstOrDefaultAsync(c => c.Id == id && c.Board.OwnerId == userId);

        if (column is null)
        {
            return false;
        }

        _context.BoardColumns.Remove(column);

        var remaining = await _context.BoardColumns
            .Where(c => c.BoardId == column.BoardId && c.Id != column.Id)
            .OrderBy(c => c.Position)
            .ToListAsync();

        for (var i = 0; i < remaining.Count; i++)
        {
            remaining[i].Position = i;
        }

        await _context.SaveChangesAsync();
        return true;
    }
}