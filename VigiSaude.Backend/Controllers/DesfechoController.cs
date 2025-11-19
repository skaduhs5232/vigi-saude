using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.TabelasAuxiliares;

namespace VigiSaude.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DesfechoController(VigisaudeDbContext context) : ControllerBase
{
    [HttpGet("GetTodosDesfechos")]
    public IActionResult GetTodosDesfechos()
    {
        var desfechos = context.Desfechos.Select(d => new DesfechoDto
        {
            IdDesfecho = d.IdDesfecho,
            DescricaoDesfecho = d.DescricaoDesfecho
        }).ToList();
        return Ok(desfechos);
    }

    [HttpGet("GetDesfecho")]
    public IActionResult GetDesfecho([FromQuery] int idDesfecho)
    {
        var desfecho = context.Desfechos.Where(d => d.IdDesfecho == idDesfecho).First();
        return Ok(desfecho);
    }

    [HttpPost("CriarDesfecho")]
    public IActionResult CriarDesfecho([FromBody] DesfechoDto desfecho)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        context.Desfechos.Add((Desfecho)desfecho);
        context.SaveChanges();
        return Ok();
    }

    [HttpPut("AlterarDesfecho")]
    public IActionResult AlterarDesfecho([FromQuery] int idDesfecho, [FromBody] DesfechoDto desfecho)
    {
        var desfechoAlterar = context.Desfechos.Where(d => d.IdDesfecho == idDesfecho).First();
        if (desfechoAlterar == null)
            return NotFound();

        desfechoAlterar.DescricaoDesfecho = desfecho.DescricaoDesfecho;
        context.SaveChanges();
        return Ok();
    }

    [HttpDelete("DeletarDesfecho")]
    public IActionResult DeletarDesfecho([FromQuery] int idDesfecho)
    {
        var desfechoAlterar = context.Desfechos.Where(d => d.IdDesfecho == idDesfecho).First();
        if (desfechoAlterar == null)
            return NotFound();

        context.Desfechos.Remove(desfechoAlterar);
        context.SaveChanges();
        return Ok();
    }
}
