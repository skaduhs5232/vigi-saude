using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.TabelasAuxiliares;

namespace VigiSaude.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CatMedQuedaController(VigisaudeDbContext context) : ControllerBase
{
    [HttpGet("GetTodosCatMedQueda")]
    public IActionResult GetTodosCatMedQueda()
    {
        var catmedqueda = context.CategoriasMedicamentoQueda.Select(d => new CatMedQuedaDTO
        {
            IdCategoriaMedicamentoQueda = d.IdCategoriaMedicamentoQueda,
            DescricaoCatMedQueda = d.DescricaoCatMedQueda
        }).ToList();
        return Ok(catmedqueda);
    }

    [HttpGet("GetCatMedQueda")]
    public IActionResult GetCatMedQueda([FromQuery] int idCategoriaMedicamentoQueda)
    {
        var catmedqueda = context.CategoriasMedicamentoQueda.Where(c => c.IdCategoriaMedicamentoQueda == idCategoriaMedicamentoQueda).First();
        return Ok(catmedqueda);
    }

    [HttpPost("CriarCatMedQueda")]
    public IActionResult CriarCatMedQueda([FromBody] CatMedQuedaDTO catmedqueda)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        context.CategoriasMedicamentoQueda.Add((CategoriasMedicamentoQuedum)catmedqueda);
        context.SaveChanges();
        return Ok();
    }

    [HttpPut("AlterarCatMedQueda")]
    public IActionResult AlterarCatMedQueda([FromQuery] int IdCategoriaMedicamentoQueda, [FromBody] CatMedQuedaDTO catmedqueda)
    {
        var categoriaAlterar = context.CategoriasMedicamentoQueda.Where(c => c.IdCategoriaMedicamentoQueda == IdCategoriaMedicamentoQueda).First();
        if (categoriaAlterar == null)
            return NotFound();

        categoriaAlterar.DescricaoCatMedQueda = catmedqueda.DescricaoCatMedQueda;
        context.SaveChanges();
        return Ok();
    }

    [HttpDelete("DeletarCatMedQueda")]
    public IActionResult DeletarCatMedQueda([FromQuery] int IdCategoriaMedicamentoQueda)
    {
        var categoriaAlterar = context.CategoriasMedicamentoQueda.Where(c => c.IdCategoriaMedicamentoQueda == IdCategoriaMedicamentoQueda).First();
        if (categoriaAlterar == null)
            return NotFound();

        context.CategoriasMedicamentoQueda.Remove(categoriaAlterar);
        context.SaveChanges();
        return Ok();
    }
}
