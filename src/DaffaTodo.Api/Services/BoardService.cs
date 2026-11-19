using DaffaTodo.Api.Data;
using DaffaTodo.Api.Dtos.Boards;
using DaffaTodo.Api.Dtos.Columns;
using DaffaTodo.Api.Dtos.Tasks;
using DaffaTodo.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace DaffaTodo.Api.Services;

public class BoardService : IBoardService
{
    private readonly AppDbContext _context;

    public BoardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<BoardSummaryResponse>> GetAllAsync(string userId)
    {
        return await _context.Boards
            .Where(b => b.OwnerId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new BoardSummaryResponse
            {
                Id = b.Id,
                Name = b.Name,
                Description = b.Description,
                CreatedAt = b.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<BoardDetailResponse?> GetByIdAsync(int id, string userId)
    {
        return await _context.Boards
            .Where(b => b.Id == id && b.OwnerId == userId)
            .Select(b => new BoardDetailResponse
            {
                Id = b.Id,
                Name = b.Name,
                Description = b.Description,
                CreatedAt = b.CreatedAt,
                Columns = b.Columns
                    .OrderBy(c => c.Position)
                    .Select(c => new ColumnResponse
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Position = c.Position,
                        Tasks = c.Tasks
                            .OrderBy(t => t.Position)
                            .Select(t => new TaskResponse
                            {
                                Id = t.Id,
                                Title = t.Title,
                                Description = t.Description,
                                Priority = t.Priority,
                                DueDate = t.DueDate,
                                Position = t.Position
                            })
                            .ToList()
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<BoardSummaryResponse> CreateAsync(string userId, BoardRequest request)
    {
        var board = new Board
        {
            Name = request.Name,
            Description = request.Description,
            OwnerId = userId,
            Columns = new List<BoardColumn>
            {
                new BoardColumn { Name = "To Do", Position = 0 },
                new BoardColumn { Name = "In Progress", Position = 1 },
                new BoardColumn { Name = "Done", Position = 2 }
            }
        };

        _context.Boards.Add(board);
        await _context.SaveChangesAsync();

        return new BoardSummaryResponse
        {
            Id = board.Id,
            Name = board.Name,
            Description = board.Description,
            CreatedAt = board.CreatedAt
        };
    }

    public async Task<bool> UpdateAsync(int id, string userId, BoardRequest request)
    {
        var board = await _context.Boards
            .FirstOrDefaultAsync(b => b.Id == id && b.OwnerId == userId);

        if (board is null)
        {
            return false;
        }

        board.Name = request.Name;
        board.Description = request.Description;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var board = await _context.Boards
            .FirstOrDefaultAsync(b => b.Id == id && b.OwnerId == userId);

        if (board is null)
        {
            return false;
        }

        _context.Boards.Remove(board);
        await _context.SaveChangesAsync();
        return true;
    }
}