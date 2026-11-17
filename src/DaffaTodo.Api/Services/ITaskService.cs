// Kontrak untuk service tugas.

using DaffaTodo.Api.Dtos.Tasks;

namespace DaffaTodo.Api.Services;

public interface ITaskService
{
    // null = kolom tidak ditemukan (atau bukan milik pengguna)
    Task<TaskResponse?> CreateAsync(int columnId, string userId, TaskRequest request);

    // bool: true = berhasil, false = tidak ditemukan
    Task<bool> UpdateAsync(int id, string userId, TaskRequest request);
    Task<bool> MoveAsync(int id, string userId, MoveTaskRequest request);
    Task<bool> DeleteAsync(int id, string userId);
}