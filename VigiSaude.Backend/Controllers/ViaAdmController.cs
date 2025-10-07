using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.TabelasAuxiliares;

namespace VigiSaude.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ViaAdmController(VigisaudeDbContext context) : ControllerBase
{
    [HttpGet("GetTodasViasAdm")]
    public IActionResult GetTodasViasAdm()
    {
        var viasAdm = context.ViasAdms.Select(v => new ViaAdmDTO
        {
            IdViaAdm = v.IdViaAdm,
            DescricaoVia = v.DescricaoVia
        }).ToList();
        return Ok(viasAdm);
    }

    [HttpGet("GetViaAdm")]
    public IActionResult GetViaAdm([FromQuery] int idViaAdm)
    {
        var viaAdm = context.ViasAdms.Where(v => v.IdViaAdm == idViaAdm).First();
        return Ok(viaAdm);
    }

    [HttpPost("CriarViaAdm")]
    public IActionResult CriarViaAdm([FromBody] ViaAdmDTO viaAdm)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        context.ViasAdms.Add((ViasAdm)viaAdm);
        context.SaveChanges();
        return Ok();
    }

    [HttpPut("AlterarViaAdm")]
    public IActionResult AlterarViaAdm([FromQuery] int idViaAdm, [FromBody] ViaAdmDTO viaAdm)
    {
        var viaAdmAlterar = context.ViasAdms.Where(v => v.IdViaAdm == idViaAdm).First();
        if (viaAdmAlterar == null)
            return NotFound();

        viaAdmAlterar.DescricaoVia = viaAdm.DescricaoVia;
        context.SaveChanges();
        return Ok();
    }

    [HttpDelete("DeletarViaAdm")]
    public IActionResult DeletarViaAdm([FromQuery] int idViaAdm)
    {
        var viaAdmAlterar = context.ViasAdms.Where(v => v.IdViaAdm == idViaAdm).First();
        if (viaAdmAlterar == null)
            return NotFound();

        context.ViasAdms.Remove(viaAdmAlterar);
        context.SaveChanges();
        return Ok();
    }
}
