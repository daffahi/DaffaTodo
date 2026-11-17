// Kontrak untuk service kolom.

using DaffaTodo.Api.Dtos.Columns;

namespace DaffaTodo.Api.Services;

public interface IColumnService
{
    // null = board tidak ditemukan (atau bukan milik pengguna)
    Task<ColumnResponse?> CreateAsync(int boardId, string userId, ColumnRequest request);
}