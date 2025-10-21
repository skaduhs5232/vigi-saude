using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.LesaoPressao;
using VigiSaude.Backend.Models.DTO.Queda;

namespace VigiSaude.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuedaController(VigisaudeDbContext context) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> RegistrarQueda(QuedaRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Paciente novoPaciente = (Paciente)request.DadosPaciente;
            context.Pacientes.Add(novoPaciente);
            await context.SaveChangesAsync();

            request.DadosPaciente.IdPaciente = novoPaciente.IdPaciente;
            request.DadosQueda.IdPaciente = novoPaciente.IdPaciente;

            Notificadore novoNotificador = (Notificadore)request.DadosNotificador;
            context.Notificadores.Add(novoNotificador);
            await context.SaveChangesAsync();

            request.DadosNotificador.IdNotificador = novoNotificador.IdNotificador;
            request.DadosQueda.IdNotificador = novoNotificador.IdNotificador;

            var novaQueda = (Models.Queda)request;

            context.Quedas.Add(novaQueda);
            await context.SaveChangesAsync();

            if (request.DadosQueda.CategoriasMedicamento != null)
            {
                foreach (var catMed in request.DadosQueda.CategoriasMedicamento)
                {
                    var relacionamento = new CategoriasMedicamentoQuedaHasQueda
                    {
                        QuedaIdIncidente = novaQueda.IdIncidente,
                        CategoriaMedicamentoQuedaIdCategoriaMedicamentoQueda = catMed.IdCategoriaMedicamentoQueda,
                        DescricaoMeds = catMed.DescricaoMeds
                    };
                    context.CategoriasMedicamentoQuedaHasQuedas.Add(relacionamento);
                }
            }
            
            if (request.DadosQueda.FatoresRisco != null)
            {
                foreach (var fator in request.DadosQueda.FatoresRisco)
                {
                    var relFator = await context.FatoresRiscoQueda
                        .FirstOrDefaultAsync(f => f.IdFatorRiscoQueda == fator.IdFatorRiscoQueda);

                    if (relFator != null)
                    {

                        novaQueda.FatorRiscoQuedaIdFatorRiscoQueda ??= new List<FatoresRiscoQuedum>();
                        novaQueda.FatorRiscoQuedaIdFatorRiscoQueda.Add(relFator);
                    }
                }
            }

            await context.SaveChangesAsync();

            return Ok("Queda registrada com sucesso.");
        }

        [HttpGet("GetTodasQuedas")]
        public async Task<IActionResult> GetTodasQuedas(int tipoIncidente)
        {
            var quedas = await context.Incidentes
                .Include(i => i.PacienteIdPacienteNavigation)
                .Include(i => i.NotificadorIdNotificadorNavigation)
                .Join(context.Quedas,
                    i => i.IdIncidente,
                    q => q.IdIncidente,
                    QuedaResponseDto.MapeamentoGet())
                .Where(q => q.DadosQueda.IdTipoIncidente == tipoIncidente)
                .ToListAsync();

            return Ok(quedas);
        }

        [HttpGet("GetQuedaPorId")]
        public async Task<IActionResult> GetQuedaPorId(int idIncidente, int tipoIncidente)
        {
            var queda = await context.Incidentes
                .Include(i => i.PacienteIdPacienteNavigation)
                .Include(i => i.NotificadorIdNotificadorNavigation)
                .Join(context.Quedas,
                    i => i.IdIncidente,
                    q => q.IdIncidente,
                    QuedaResponseDto.MapeamentoGet())
                .Where(q => q.DadosQueda.IdTipoIncidente == tipoIncidente
                         && q.DadosQueda.IdQueda == idIncidente)
                .FirstOrDefaultAsync();

            if (queda == null)
                return NotFound();

            return Ok(queda);
        }

        [HttpPut("AtualizarQueda/{idIncidente}")]
        public async Task<IActionResult> AtualizarQueda(int idIncidente, [FromBody] QuedaResponseDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var incidente = await context.Incidentes
                .Include(i => i.PacienteIdPacienteNavigation)
                .FirstOrDefaultAsync(i => i.IdIncidente == idIncidente);

            if (incidente == null)
                return NotFound();

            var queda = await context.Quedas
                .Include(q => q.CategoriasMedicamentoQuedaHasQueda)
                .Include(q => q.FatorRiscoQuedaIdFatorRiscoQueda)
                .FirstOrDefaultAsync(q => q.IdIncidente == idIncidente);

            var notificador = await context.Notificadores
                .FirstOrDefaultAsync(n => n.IdNotificador == incidente.NotificadorIdNotificador);

            if (queda == null || notificador == null || incidente.PacienteIdPacienteNavigation == null)
                return NotFound();

            var paciente = incidente.PacienteIdPacienteNavigation;
            paciente.Nome = request.DadosPaciente.Nome;
            paciente.Prontuario = request.DadosPaciente.Protuario;
            paciente.Leito = request.DadosPaciente.Leito;
            paciente.Sexo = request.DadosPaciente.Sexo;
            paciente.Peso = request.DadosPaciente.Peso;
            paciente.DataNascimento = request.DadosPaciente.DataNascimento;
            paciente.HoraNascimento = request.DadosPaciente.HoraNascimento;
            paciente.DataAdmissao = request.DadosPaciente.DataAdmissao;

            notificador.Nome = request.DadosNotificador.Nome;
            notificador.Email = request.DadosNotificador.Email;
            notificador.Telefone = request.DadosNotificador.Telefone;
            notificador.CategoriaProfissional = request.DadosNotificador.Categoria;
            notificador.SetorIdSetor = request.DadosNotificador.Setor;
            notificador.FuncionarioGerenciaRisco = request.DadosNotificador.FuncionarioGerenciaRisco;

            incidente.SetorIdSetor = request.DadosQueda.IdSetor;
            incidente.TipoIncidenteIdTipoIncidente = request.DadosQueda.IdTipoIncidente;
            incidente.NotificadorIdNotificador = notificador.IdNotificador;
            incidente.DataInicio = request.DadosQueda.DataInicio;
            incidente.DataFim = request.DadosQueda.DataFim;
            incidente.Descricao = request.DadosQueda.Descricao;
            incidente.DataNotificacao = request.DadosQueda.DataNotificacao;
            incidente.ClassificacaoIncidente = request.DadosQueda.ClassificacaoIncidente;
            incidente.ClassificacaoDano = request.DadosQueda.ClassificacaoDano;

            queda.Diagnostico = request.DadosQueda.Diagnostico;
            queda.AvaliacaoRiscoAdmissao = request.DadosQueda.AvaliacaoRiscoAdmissao;
            queda.RegistroOrientacaoProntuario = request.DadosQueda.RegistroOrientacaoProntuario;
            queda.RiscoIdentificadoAdmissao = request.DadosQueda.RiscoIdentificadoAdmissao;
            queda.PacienteComAcompanhante = request.DadosQueda.PacienteComAcompanhante;
            queda.QtdMedBaixoRisco = request.DadosQueda.QtdMedBaixoRisco;
            queda.QtdMedMedioRisco = request.DadosQueda.QtdMedMedioRisco;
            queda.QtdMedAltoRisco = request.DadosQueda.QtdMedAltoRisco;
            queda.TipoQuedaIdTipoQueda = request.DadosQueda.TipoQuedaId;
            queda.LocalQuedaIdLocalQueda = request.DadosQueda.LocalQuedaId;
            queda.Horario = request.DadosQueda.Horario;
            queda.Turno = request.DadosQueda.Turno;
            queda.Desfecho = request.DadosQueda.Desfecho;

            context.CategoriasMedicamentoQuedaHasQuedas.RemoveRange(queda.CategoriasMedicamentoQuedaHasQueda);

            if (request.DadosQueda.CategoriasMedicamento != null)
            {
                queda.CategoriasMedicamentoQuedaHasQueda = request.DadosQueda.CategoriasMedicamento.Select(catMed => new CategoriasMedicamentoQuedaHasQueda
                {
                    QuedaIdIncidente = idIncidente,
                    CategoriaMedicamentoQuedaIdCategoriaMedicamentoQueda = catMed.IdCategoriaMedicamentoQueda,
                    DescricaoMeds = catMed.DescricaoMeds
                }).ToList();
            }

            queda.FatorRiscoQuedaIdFatorRiscoQueda.Clear();

            if (request.DadosQueda.FatoresRisco != null)
            {
                foreach (var fator in request.DadosQueda.FatoresRisco)
                {
                    var fatorRisco = await context.FatoresRiscoQueda
                        .FirstOrDefaultAsync(f => f.IdFatorRiscoQueda == fator.IdFatorRiscoQueda);

                    if (fatorRisco != null)
                    {
                        queda.FatorRiscoQuedaIdFatorRiscoQueda.Add(fatorRisco);
                    }
                }
            }

            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
