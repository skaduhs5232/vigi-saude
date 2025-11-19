using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.TabelasAuxiliares;

namespace VigiSaude.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TipoQuedaController(VigisaudeDbContext context) : ControllerBase
{
    [HttpGet("GetTodosTiposQueda")]
    public IActionResult GetTodosTiposQueda()
    {
        var tiposQueda = context.TiposQueda.Select(q => new TipoQuedaDTO
        {
            IdTipoQueda = q.IdTipoQueda,
            DescricaoTipo = q.DescricaoTipo
        }).ToList();
        return Ok(tiposQueda);
    }

    [HttpGet("GetTipoQueda")]
    public IActionResult GetTipoQueda([FromQuery] int idTipoQueda)
    {
        var tipoQueda = context.TiposQueda.Where(q => q.IdTipoQueda == idTipoQueda).First();
        return Ok(tipoQueda);
    }

    [HttpPost("CriarTipoQueda")]
    public IActionResult CriarTipoQueda([FromBody] TipoQuedaDTO tipoQueda)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        context.TiposQueda.Add((TiposQuedum)tipoQueda);
        context.SaveChanges();
        return Ok();
    }

    [HttpPut("AlterarTipoQueda")]
    public IActionResult AlterarTipoQueda([FromQuery] int idTipoQueda, [FromBody] TipoQuedaDTO tipoQueda)
    {
        var tipoQuedaAlterar = context.TiposQueda.Where(q => q.IdTipoQueda == idTipoQueda).First();
        if (tipoQuedaAlterar == null)
            return NotFound();

        tipoQuedaAlterar.DescricaoTipo = tipoQueda.DescricaoTipo;
        context.SaveChanges();
        return Ok();
    }

    [HttpDelete("DeletarTipoQueda")]
    public IActionResult DeletarTipoQueda([FromQuery] int idTipoQueda)
    {
        var tipoQuedaAlterar = context.TiposQueda.Where(q => q.IdTipoQueda == idTipoQueda).First();
        if (tipoQuedaAlterar == null)
            return NotFound();

        context.TiposQueda.Remove(tipoQuedaAlterar);
        context.SaveChanges();
        return Ok();
    }
}
