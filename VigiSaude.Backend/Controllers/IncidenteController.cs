using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.LesaoPressao;

namespace VigiSaude.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class IncidenteController(VigisaudeDbContext context) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> RegistrarLesaoPressao(RequestNovaLesaoPressaoDTO request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        Paciente novoPaciente = (Paciente)request.Paciente;
        context.Pacientes.Add(novoPaciente);
        context.SaveChanges();
        request.Paciente.IdPaciente = novoPaciente.IdPaciente;
        request.LesaoPressao.IdPaciente = novoPaciente.IdPaciente;

        await context.Lesoespressaos.AddAsync((Lesoespressao)request);
        await context.SaveChangesAsync();

        return Ok(ModelState);
    }
}
