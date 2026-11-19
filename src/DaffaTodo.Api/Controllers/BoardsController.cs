using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using DaffaTodo.Api.Dtos.Boards;
using DaffaTodo.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DaffaTodo.Api.Extensions;

namespace DaffaTodo.Api.Controllers;

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

    private string UserId => User.GetUserId();

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var boards = await _boardService.GetAllAsync(UserId);
        return Ok(boards);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var board = await _boardService.GetByIdAsync(id, UserId);
        return board is null ? NotFound() : Ok(board);
    }

    [HttpPost]
    public async Task<IActionResult> Create(BoardRequest request)
    {
        var board = await _boardService.CreateAsync(UserId, request);

        return CreatedAtAction(nameof(GetById), new { id = board.Id }, board);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, BoardRequest request)
    {
        var updated = await _boardService.UpdateAsync(id, UserId, request);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _boardService.DeleteAsync(id, UserId);
        return deleted ? NoContent() : NotFound();
    }
}