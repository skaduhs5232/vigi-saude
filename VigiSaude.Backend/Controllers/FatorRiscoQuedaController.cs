using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.TabelasAuxiliares;

namespace VigiSaude.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FatorRiscoQuedaController(VigisaudeDbContext context) : ControllerBase
{
    [HttpGet("GetTodosFatoresRiscoQueda")]
    public IActionResult GetTodosFatoresRiscoQueda()
    {
        var fatores = context.FatoresRiscoQueda.Select(f => new FatoresRiscoQuedaDTO
        {
            IdFatorRiscoQueda = f.IdFatorRiscoQueda,
            DescricaoFator = f.DescricaoFator
        }).ToList();
        return Ok(fatores);
    }

    [HttpGet("GetFatorRiscoQueda")]
    public IActionResult GetFatorRiscoQueda([FromQuery] int idFatorRiscoQueda)
    {
        var fator = context.FatoresRiscoQueda.Where(f => f.IdFatorRiscoQueda == idFatorRiscoQueda).First();
        return Ok(fator);
    }

    [HttpPost("CriarFatorRiscoQueda")]
    public IActionResult CriarFatorRiscoQueda([FromBody] FatoresRiscoQuedaDTO fator)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        context.FatoresRiscoQueda.Add((FatoresRiscoQuedum)fator);
        context.SaveChanges();
        return Ok();
    }

    [HttpPut("AlterarFatorRiscoQueda")]
    public IActionResult AlterarFatorRiscoQueda([FromQuery] int idFatorRiscoQueda, [FromBody] FatoresRiscoQuedaDTO fator)
    {
        var fatorAlterar = context.FatoresRiscoQueda.Where(f => f.IdFatorRiscoQueda == idFatorRiscoQueda).First();
        if (fatorAlterar == null)
            return NotFound();

        fatorAlterar.DescricaoFator = fator.DescricaoFator;
        context.SaveChanges();
        return Ok();
    }

    [HttpDelete("DeletarFatorRiscoQueda")]
    public IActionResult DeletarFatorRiscoQueda([FromQuery] int idFatorRiscoQueda)
    {
        var fatorAlterar = context.FatoresRiscoQueda.Where(f => f.IdFatorRiscoQueda == idFatorRiscoQueda).First();
        if (fatorAlterar == null)
            return NotFound();

        context.FatoresRiscoQueda.Remove(fatorAlterar);
        context.SaveChanges();
        return Ok();
    }
}
