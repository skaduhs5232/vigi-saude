using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.TabelasAuxiliares;

namespace VigiSaude.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SetorController(VigisaudeDbContext context) : ControllerBase
{
    [HttpGet("GetTodosSetores")]
    public IActionResult GetTodosSetores()
    {
        var setores = context.Setores.Select(s => new SetorDTO
        {
            IdSetor = s.IdSetor,
            DescricaoSetor = s.DescricaoSetor
        }).ToList();
        return Ok(setores);
    }

    [HttpGet("GetSetor")]
    public IActionResult GetSetor([FromQuery] int idSetor)
    {
        var setor = context.Setores.Where(s => s.IdSetor == idSetor).First();
        return Ok(setor);
    }

    [HttpPost("CriarSetor")]
    public IActionResult CriarSetor([FromBody] SetorDTO setor)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        context.Setores.Add((Setore)setor);
        context.SaveChanges();
        return Ok();
    }

    [HttpPut("AlterarSetor")]
    public IActionResult AlterarSetor([FromQuery] int idSetor, [FromBody] SetorDTO setor)
    {
        var setorAlterar = context.Setores.Where(s => s.IdSetor == idSetor).First();
        if (setorAlterar == null)
            return NotFound();

        setorAlterar.DescricaoSetor = setor.DescricaoSetor;
        context.SaveChanges();
        return Ok();
    }

    [HttpDelete("DeletarSetor")]
    public IActionResult DeletarSetor([FromQuery] int idSetor)
    {
        var setorAlterar = context.Setores.Where(s => s.IdSetor == idSetor).First();
        if (setorAlterar == null)
            return NotFound();

        context.Setores.Remove(setorAlterar);
        context.SaveChanges();
        return Ok();
    }
}
