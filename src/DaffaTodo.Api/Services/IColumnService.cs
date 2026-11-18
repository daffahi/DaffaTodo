// Kontrak untuk service kolom.

using DaffaTodo.Api.Dtos.Columns;

namespace DaffaTodo.Api.Services;

public interface IColumnService
{
    // null = papan tidak ditemukan (atau bukan milik pengguna)
    Task<ColumnResponse?> CreateAsync(int boardId, string userId, ColumnRequest request);

    // bool: true = berhasil, false = kolom tidak ditemukan (atau bukan milik pengguna)
    Task<bool> UpdateAsync(int id, string userId, ColumnRequest request);
    Task<bool> DeleteAsync(int id, string userId);
}