using DaffaTodo.Api.Dtos.Boards;

namespace DaffaTodo.Api.Services;

public interface IBoardService
{
    Task<List<BoardSummaryResponse>> GetAllAsync(string userId);

    Task<BoardDetailResponse?> GetByIdAsync(int id, string userId);

    Task<BoardSummaryResponse> CreateAsync(string userId, BoardRequest request);

    Task<bool> UpdateAsync(int id, string userId, BoardRequest request);
    Task<bool> DeleteAsync(int id, string userId);
}