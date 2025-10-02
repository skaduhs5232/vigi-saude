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
    public async Task<IActionResult> RegistrarLesaoPressao(RequestNovaLesaoPressaoDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        Paciente novoPaciente = (Paciente)request.DadosPaciente;
        context.Pacientes.Add(novoPaciente);
        context.SaveChanges();
        request.DadosPaciente.IdPaciente = novoPaciente.IdPaciente;
        request.DadosLesaoPresao.IdPaciente = novoPaciente.IdPaciente;

        Notificadore novoNotificador = (Notificadore)request.DadosNotificador;
        context.Notificadores.Add(novoNotificador);
        context.SaveChanges();
        request.DadosNotificador.IdNotificador = novoNotificador.IdNotificador;
        request.DadosLesaoPresao.IdNotificador = novoNotificador.IdNotificador;

        await context.LesoesPressaos.AddAsync((LesoesPressao)request);
        await context.SaveChangesAsync();

        return Ok(ModelState);
    }
}
