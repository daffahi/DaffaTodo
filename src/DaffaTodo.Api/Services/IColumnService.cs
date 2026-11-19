using DaffaTodo.Api.Dtos.Columns;

namespace DaffaTodo.Api.Services;

public interface IColumnService
{
    Task<ColumnResponse?> CreateAsync(int boardId, string userId, ColumnRequest request);

    Task<bool> UpdateAsync(int id, string userId, ColumnRequest request);
    Task<bool> DeleteAsync(int id, string userId);
}