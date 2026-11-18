// Pintu masuk HTTP untuk kolom.

using DaffaTodo.Api.Dtos.Columns;
using DaffaTodo.Api.Extensions;
using DaffaTodo.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DaffaTodo.Api.Controllers;

// Route dasar cuma "api" karena alamat kolom bersarang di bawah papan (boards/{id}/columns)
[Authorize]
[ApiController]
[Route("api")]
public class ColumnsController : ControllerBase
{
    private readonly IColumnService _columnService;

    public ColumnsController(IColumnService columnService)
    {
        _columnService = columnService;
    }

    private string UserId => User.GetUserId();

    // POST /api/boards/5/columns
    [HttpPost("boards/{boardId:int}/columns")]
    public async Task<IActionResult> Create(int boardId, ColumnRequest request)
    {
        var column = await _columnService.CreateAsync(boardId, UserId, request);

        // Belum ada endpoint GET untuk satu kolom, jadi 201 dikirim langsung tanpa CreatedAtAction
        return column is null
            ? NotFound()
            : StatusCode(StatusCodes.Status201Created, column);
    }

    // PUT /api/columns/
    [HttpPut("columns/{id:int}")]
    public async Task<IActionResult> Update(int id, ColumnRequest request)
    {
        var updated = await _columnService.UpdateAsync(id, UserId, request);
        return updated ? NoContent() : NotFound();
    }

    // DELETE /api/columns/
    [HttpDelete("columns/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _columnService.DeleteAsync(id, UserId);
        return deleted ? NoContent() : NotFound();
    }
}