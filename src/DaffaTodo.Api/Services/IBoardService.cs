// Kontrak: daftar pekerjaan yang bisa dilakukan service papan (board). Setiap method menerima userId supaya kepemilikan selalu diperiksa.

using DaffaTodo.Api.Dtos.Boards;

namespace DaffaTodo.Api.Services;

public interface IBoardService
{
    Task<List<BoardSummaryResponse>> GetAllAsync(string userId);

    // Tanda "?" artinya bisa mengembalikan null (board tidak ditemukan)
    Task<BoardDetailResponse?> GetByIdAsync(int id, string userId);

    Task<BoardSummaryResponse> CreateAsync(string userId, BoardRequest request);

    // bool: true = berhasil, false = board tidak ditemukan
    Task<bool> UpdateAsync(int id, string userId, BoardRequest request);
    Task<bool> DeleteAsync(int id, string userId);
}