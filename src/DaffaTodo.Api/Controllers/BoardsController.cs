// Pintu masuk HTTP untuk papan. Tugasnya hanya menerima request, mengambil id pengguna dari token, memanggil service, lalu memilih kode balasan yang tepat.

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using DaffaTodo.Api.Dtos.Boards;
using DaffaTodo.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DaffaTodo.Api.Controllers;

// [Authorize] di atas class = semua endpoint di sini wajib membawa token yang valid
[Authorize]
[ApiController]
[Route("api/boards")]
public class BoardsController : ControllerBase
{
    private readonly IBoardService _boardService;

    public BoardsController(IBoardService boardService)
    {
        _boardService = boardService;
    }

    // Id pengguna diambil dari claim "sub" di dalam token (yang kita isi di TokenService)
    private string UserId => User.FindFirstValue(JwtRegisteredClaimNames.Sub)!;

    // GET /api/boards
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var boards = await _boardService.GetAllAsync(UserId);
        return Ok(boards);
    }

    // GET /api/boards/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var board = await _boardService.GetByIdAsync(id, UserId);
        return board is null ? NotFound() : Ok(board);
    }

    // POST /api/boards
    [HttpPost]
    public async Task<IActionResult> Create(BoardRequest request)
    {
        var board = await _boardService.CreateAsync(UserId, request);

        // 201 Created, plus alamat untuk mengambil papan yang baru dibuat
        return CreatedAtAction(nameof(GetById), new { id = board.Id }, board);
    }

    // PUT /api/boards/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, BoardRequest request)
    {
        var updated = await _boardService.UpdateAsync(id, UserId, request);
        return updated ? NoContent() : NotFound();
    }

    // DELETE /api/boards/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _boardService.DeleteAsync(id, UserId);
        return deleted ? NoContent() : NotFound();
    }
}