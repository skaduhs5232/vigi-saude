using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.TabelasAuxiliares;

namespace VigiSaude.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LocalLesaoController(VigisaudeDbContext context) : ControllerBase
{
    [HttpGet("GetTodosLocaisLesao")]
    public IActionResult GetTodosLocaisLesao()
    {
        var locaisLesao = context.LocaisLesaos.Select(l => new LocalLesaoDTO
        {
            IdLocalLesao = l.IdLocalLesao,
            DescricaoLocal = l.DescricaoLocal
        }).ToList();
        return Ok(locaisLesao);
    }

    [HttpGet("GetLocalLesao")]
    public IActionResult GetLocalLesao([FromQuery] int idLocalLesao)
    {
        var localLesao = context.LocaisLesaos.Where(l => l.IdLocalLesao == idLocalLesao).First();
        return Ok(localLesao);
    }

    [HttpPost("CriarLocalLesao")]
    public IActionResult CriarLocalLesao([FromBody] LocalLesaoDTO localLesao)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        context.LocaisLesaos.Add((LocaisLesao)localLesao);
        context.SaveChanges();
        return Ok();
    }

    [HttpPut("AlterarLocalLesao")]
    public IActionResult AlterarLocalLesao([FromQuery] int idLocalLesao, [FromBody] LocalLesaoDTO localLesao)
    {
        var localLesaoAlterar = context.LocaisLesaos.Where(l => l.IdLocalLesao == idLocalLesao).First();
        if (localLesaoAlterar == null)
            return NotFound();

        localLesaoAlterar.DescricaoLocal = localLesao.DescricaoLocal;
        context.SaveChanges();
        return Ok();
    }

    [HttpDelete("DeletarLocalLesao")]
    public IActionResult DeletarLocalLesao([FromQuery] int idLocalLesao)
    {
        var localLesaoAlterar = context.LocaisLesaos.Where(l => l.IdLocalLesao == idLocalLesao).First();
        if (localLesaoAlterar == null)
            return NotFound();

        context.LocaisLesaos.Remove(localLesaoAlterar);
        context.SaveChanges();
        return Ok();
    }
}
