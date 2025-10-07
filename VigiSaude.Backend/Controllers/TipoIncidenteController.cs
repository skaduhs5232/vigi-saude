using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.TabelasAuxiliares;

namespace VigiSaude.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TipoIncidenteController(VigisaudeDbContext context) : ControllerBase
{
    [HttpGet("GetTodosTiposIncidentes")]
    public IActionResult GetTodosTiposIncidentes()
    {
        var tiposincidente = context.TiposIncidentes.Select(t => new TipoIncidenteDTO
        {
            IdTipoIncidente = t.IdTipoIncidente,
            DescricaoTipoIncidente = t.DescricaoTipoIncidente
        }).ToList();
        return Ok(tiposincidente);
    }

    [HttpGet("GetTipoIncidente")]
    public IActionResult GetDesfecho([FromQuery] int idTipoIncidente)
    {
        var tipoincidente = context.TiposIncidentes.Where(t => t.IdTipoIncidente == idTipoIncidente).First();
        return Ok(tipoincidente);
    }

    [HttpPost("CriarTipoIncidente")]
    public IActionResult CriarTipoIncidente([FromBody] TipoIncidenteDTO tipoincidente)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        context.TiposIncidentes.Add((TiposIncidente)tipoincidente);
        context.SaveChanges();
        return Ok();
    }

    [HttpPut("AlterarTipoIncidente")]
    public IActionResult AlterarTipoIncidente([FromQuery] int idTipoIncidente, [FromBody] TipoIncidenteDTO tipoincidente)
    {
        var tipoIncidenteAlterar = context.TiposIncidentes.Where(t => t.IdTipoIncidente == idTipoIncidente).First();
        if (tipoIncidenteAlterar == null)
            return NotFound();

        tipoIncidenteAlterar.DescricaoTipoIncidente = tipoincidente.DescricaoTipoIncidente;
        context.SaveChanges();
        return Ok();
    }

    [HttpDelete("DeletarTipoIncidente")]
    public IActionResult DeletarTipoIncidente([FromQuery] int idTipoIncidente)
    {
        var tipoIncidenteAlterar = context.TiposIncidentes.Where(t => t.IdTipoIncidente == idTipoIncidente).First();
        if (tipoIncidenteAlterar == null)
            return NotFound();

        context.TiposIncidentes.Remove(tipoIncidenteAlterar);
        context.SaveChanges();
        return Ok();
    }
}
