using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.Ram; 
using System.Threading.Tasks;
using System.Linq;

namespace VigiSaude.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RamController(VigisaudeDbContext context) : ControllerBase
    {
        [HttpPost("RegistrarRam")]
        public async Task<IActionResult> RegistrarRam([FromBody] RamRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Paciente novoPaciente = (Paciente)request.DadosPaciente;
            context.Pacientes.Add(novoPaciente);
            await context.SaveChangesAsync();

            request.DadosPaciente.IdPaciente = novoPaciente.IdPaciente;
            request.DadosRam.IdPaciente = novoPaciente.IdPaciente;

            Notificadore novoNotificador = (Notificadore)request.DadosNotificador;
            context.Notificadores.Add(novoNotificador);
            await context.SaveChangesAsync();

            request.DadosNotificador.IdNotificador = novoNotificador.IdNotificador;
            request.DadosRam.IdNotificador = novoNotificador.IdNotificador;

            if (request.DetalhesRam != null)
            {
                foreach (var detalhe in request.DetalhesRam)
                {
                    if (detalhe.IdMedicamento == null || detalhe.IdMedicamento == 0)
                    {
                        var novoMed = new Medicamento
                        {
                            NomeGenerico = detalhe.NomeGenerico,
                            Fabricante = detalhe.Fabricante,
                            Lote = detalhe.Lote,
                            Validade = detalhe.Validade
                        };
                        context.Medicamentos.Add(novoMed);
                        await context.SaveChangesAsync();

                        detalhe.IdMedicamento = novoMed.IdMedicamento;
                    }
                }
            }

            var ramEntidade = (Ram)request;

            context.Rams.Add(ramEntidade);
            await context.SaveChangesAsync();

            return Ok("RAM registrada com sucesso.");
        }

        [HttpGet("GetTodasRams")]
        public async Task<IActionResult> GetTodasRams(int tipoIncidente)
        {
            var rams = await context.Incidentes
                .Include(i => i.PacienteIdPacienteNavigation)
                .Include(i => i.NotificadorIdNotificadorNavigation)
                .Join(context.Rams,
                    i => i.IdIncidente,
                    r => r.IdIncidente,
                    RamResponseDto.MapeamentoGet() 
                )
                .Where(r => r.DadosRam.IdTipoIncidente == tipoIncidente)
                .ToListAsync();

            return Ok(rams);
        }

        [HttpGet("GetRamPorId")]
        public async Task<IActionResult> GetRamPorId(int idIncidente, int tipoIncidente)
        {
            var ram = await context.Incidentes
                .Include(i => i.PacienteIdPacienteNavigation)
                .Include(i => i.NotificadorIdNotificadorNavigation)
                .Join(context.Rams,
                    i => i.IdIncidente,
                    r => r.IdIncidente,
                    RamResponseDto.MapeamentoGet()
                )
                .Where(r => r.DadosRam.IdTipoIncidente == tipoIncidente
                         && r.DadosRam.IdRam == idIncidente)
                .FirstOrDefaultAsync();

            if (ram == null)
                return NotFound();

            return Ok(ram);
        }

        [HttpPut("AtualizarRam/{idIncidente}")]
        public async Task<IActionResult> AtualizarRam(int idIncidente, [FromBody] RamResponseDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var incidente = await context.Incidentes
                .Include(i => i.PacienteIdPacienteNavigation)
                .FirstOrDefaultAsync(i => i.IdIncidente == idIncidente);

            if (incidente == null)
                return NotFound();

            var ram = await context.Rams
                .Include(r => r.RamHasMedicamentos)
                .FirstOrDefaultAsync(r => r.IdIncidente == idIncidente);

            if (ram == null || incidente.PacienteIdPacienteNavigation == null)
                return NotFound();

            var notificador = await context.Notificadores
                .FirstOrDefaultAsync(n => n.IdNotificador == incidente.NotificadorIdNotificador);

            if (notificador == null)
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

            incidente.SetorIdSetor = request.DadosRam.IdSetor;
            incidente.TipoIncidenteIdTipoIncidente = request.DadosRam.IdTipoIncidente;
            incidente.NotificadorIdNotificador = notificador.IdNotificador;
            incidente.DataInicio = request.DadosRam.DataInicio;
            incidente.DataFim = request.DadosRam.DataFim;
            incidente.Descricao = request.DadosRam.Descricao;
            incidente.DataNotificacao = request.DadosRam.DataNotificacao;
            incidente.ClassificacaoIncidente = request.DadosRam.ClassificacaoIncidente;
            incidente.ClassificacaoDano = request.DadosRam.ClassificacaoDano;

            if (request.DetalhesRam != null)
            {
                foreach (var detalheDto in request.DetalhesRam)
                {
                    if (detalheDto.IdMedicamento == null || detalheDto.IdMedicamento == 0)
                    {
                        var novoMed = new Medicamento
                        {
                            NomeGenerico = detalheDto.NomeGenerico,
                            Fabricante = detalheDto.Fabricante,
                            Lote = detalheDto.Lote,
                            Validade = detalheDto.Validade
                        };
                        context.Medicamentos.Add(novoMed);
                        await context.SaveChangesAsync();

                        detalheDto.IdMedicamento = novoMed.IdMedicamento;
                    }
                    else
                    {
                        var medExistente = await context.Medicamentos.FindAsync(detalheDto.IdMedicamento);
                        if (medExistente != null)
                        {
                            medExistente.NomeGenerico = detalheDto.NomeGenerico;
                            medExistente.Fabricante = detalheDto.Fabricante;
                            medExistente.Lote = detalheDto.Lote;
                            medExistente.Validade = detalheDto.Validade;
                        }
                    }
                }

                context.RamHasMedicamentos.RemoveRange(ram.RamHasMedicamentos);

                ram.RamHasMedicamentos = request.DetalhesRam.Select(d => new RamHasMedicamento
                {
                    RamIdIncidente = idIncidente,
                    MedicamentoIdMedicamento = d.IdMedicamento!.Value,
                    ViaAdmIdViaAdm = d.IdViaAdm,
                    DesfechoIdDesfecho = d.IdDesfecho,
                    AcaoAdotada = d.AcaoAdotada,
                    MedProvavelCausador = d.MedProvavelCausador,
                    Posologia = d.Posologia,
                    DataInicioMed = d.DataInicioMed?.ToString("yyyy-MM-dd"),
                    DataFimMed = d.DataFimMed?.ToString("yyyy-MM-dd"),
                    Indicacao = d.Indicacao
                }).ToList();
            }

            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
