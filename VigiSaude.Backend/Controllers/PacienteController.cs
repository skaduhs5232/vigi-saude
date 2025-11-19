using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;

namespace VigiSaude.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PacienteController(VigisaudeDbContext context) : ControllerBase
{
    [HttpPost]
    public IActionResult CadastrarPaciente(Paciente novoPaciente)
    {
        context.Pacientes.Add(novoPaciente);
        context.SaveChanges();
        return Ok();
    }
}
