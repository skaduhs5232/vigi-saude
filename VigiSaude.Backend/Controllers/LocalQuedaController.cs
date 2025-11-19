using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.TabelasAuxiliares;

namespace VigiSaude.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LocalQuedaController(VigisaudeDbContext context) : ControllerBase
{
    [HttpGet("GetTodosLocaisQueda")]
    public IActionResult GetTodosLocaisQueda()
    {
        var locaisQueda = context.LocaisQueda.Select(q => new LocalQuedaDTO
        {
            IdLocalQueda = q.IdLocalQueda,
            DescricaoLocal = q.DescricaoLocal
        }).ToList();
        return Ok(locaisQueda);
    }

    [HttpGet("GetLocalQueda")]
    public IActionResult GetLocalQueda([FromQuery] int idLocalQueda)
    {
        var localQueda = context.LocaisQueda.Where(q => q.IdLocalQueda == idLocalQueda).First();
        return Ok(localQueda);
    }

    [HttpPost("CriarLocalQueda")]
    public IActionResult CriarLocalQueda([FromBody] LocalQuedaDTO localQueda)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        context.LocaisQueda.Add((LocaisQuedum)localQueda);
        context.SaveChanges();
        return Ok();
    }

    [HttpPut("AlterarLocalQueda")]
    public IActionResult AlterarLocalQueda([FromQuery] int idLocalQueda, [FromBody] LocalQuedaDTO localQueda)
    {
        var localQuedaAlterar = context.LocaisQueda.Where(q => q.IdLocalQueda == idLocalQueda).First();
        if (localQuedaAlterar == null)
            return NotFound();

        localQuedaAlterar.DescricaoLocal = localQueda.DescricaoLocal;
        context.SaveChanges();
        return Ok();
    }

    [HttpDelete("DeletarLocalQueda")]
    public IActionResult DeletarLocalQueda([FromQuery] int idLocalQueda)
    {
        var localQuedaAlterar = context.LocaisQueda.Where(q => q.IdLocalQueda == idLocalQueda).First();
        if (localQuedaAlterar == null)
            return NotFound();

        context.LocaisQueda.Remove(localQuedaAlterar);
        context.SaveChanges();
        return Ok();
    }
}
