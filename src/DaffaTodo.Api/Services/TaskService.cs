// Seluruh logika tugas, termasuk penataan ulang urutan saat tugas dipindah.

using DaffaTodo.Api.Data;
using DaffaTodo.Api.Dtos.Tasks;
using DaffaTodo.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace DaffaTodo.Api.Services;

public class TaskService : ITaskService
{
    private readonly AppDbContext _context;

    public TaskService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TaskResponse?> CreateAsync(int columnId, string userId, TaskRequest request)
    {
        // Menelusuri rantai: kolom -> papan -> pemilik. Tidak perlu Include karena hanya dipakai di filter
        var columnExists = await _context.BoardColumns
            .AnyAsync(c => c.Id == columnId && c.Board.OwnerId == userId);

        if (!columnExists)
        {
            return null;
        }

        // Tugas baru ditaruh paling bawah di kolomnya
        var lastPosition = await _context.TaskItems
            .Where(t => t.BoardColumnId == columnId)
            .MaxAsync(t => (int?)t.Position) ?? -1;

        var task = new TaskItem
        {
            BoardColumnId = columnId,
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            DueDate = request.DueDate,
            Position = lastPosition + 1
        };

        _context.TaskItems.Add(task);
        await _context.SaveChangesAsync();

        return ToResponse(task);
    }

    public async Task<bool> UpdateAsync(int id, string userId, TaskRequest request)
    {
        var task = await _context.TaskItems
            .FirstOrDefaultAsync(t => t.Id == id && t.BoardColumn.Board.OwnerId == userId);

        if (task is null)
        {
            return false;
        }

        // Update tidak menyentuh Position dan kolom. Itu urusan Move
        task.Title = request.Title;
        task.Description = request.Description;
        task.Priority = request.Priority;
        task.DueDate = request.DueDate;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> MoveAsync(int id, string userId, MoveTaskRequest request)
    {
        var task = await _context.TaskItems
            .FirstOrDefaultAsync(t => t.Id == id && t.BoardColumn.Board.OwnerId == userId);

        if (task is null)
        {
            return false;
        }

        var sourceColumnId = task.BoardColumnId;

        // Kolom tujuan harus milik pengguna dan berada di papan yang sama dengan kolom asal.
        // Cek terakhir: "papan kolom tujuan punya kolom asal tugas" = papannya sama
        var targetColumn = await _context.BoardColumns
            .FirstOrDefaultAsync(c => c.Id == request.BoardColumnId
                && c.Board.OwnerId == userId
                && c.Board.Columns.Any(x => x.Id == sourceColumnId));

        if (targetColumn is null)
        {
            return false;
        }

        // Ambil semua tugas di kolom tujuan (tanpa tugas yang sedang dipindah), urut berdasarkan posisi
        var targetTasks = await _context.TaskItems
            .Where(t => t.BoardColumnId == targetColumn.Id && t.Id != task.Id)
            .OrderBy(t => t.Position)
            .ToListAsync();

        // Sisipkan tugas di posisi yang diminta. Clamp menjaga angkanya tidak melebihi jumlah tugas
        var index = Math.Clamp(request.Position, 0, targetTasks.Count);
        targetTasks.Insert(index, task);
        task.BoardColumnId = targetColumn.Id;

        // Beri nomor urut ulang 0, 1, 2, ... di kolom tujuan
        for (var i = 0; i < targetTasks.Count; i++)
        {
            targetTasks[i].Position = i;
        }

        // Kalau pindah kolom, kolom asal juga ditata ulang supaya tidak ada celah urutan
        if (sourceColumnId != targetColumn.Id)
        {
            var sourceTasks = await _context.TaskItems
                .Where(t => t.BoardColumnId == sourceColumnId && t.Id != task.Id)
                .OrderBy(t => t.Position)
                .ToListAsync();

            for (var i = 0; i < sourceTasks.Count; i++)
            {
                sourceTasks[i].Position = i;
            }
        }

        // Semua perubahan disimpan sekaligus dalam satu transaksi
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var task = await _context.TaskItems
            .FirstOrDefaultAsync(t => t.Id == id && t.BoardColumn.Board.OwnerId == userId);

        if (task is null)
        {
            return false;
        }

        // Celah urutan setelah hapus tidak masalah, tugas tetap diurutkan lewat Position
        _context.TaskItems.Remove(task);
        await _context.SaveChangesAsync();
        return true;
    }

    // Mengubah entity menjadi DTO. static karena tidak memakai data milik class
    private static TaskResponse ToResponse(TaskItem task)
    {
        return new TaskResponse
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Priority = task.Priority,
            DueDate = task.DueDate,
            Position = task.Position
        };
    }
}