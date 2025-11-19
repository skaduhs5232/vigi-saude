using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.ErroMedicacao;

namespace VigiSaude.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ErroMedicacaoController(VigisaudeDbContext context) : ControllerBase
    {
        [HttpPost("RegistrarErroMedicacao")]
        public async Task<IActionResult> RegistrarErroMedicacao([FromBody] ErroMedicacaoRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Paciente novoPaciente = (Paciente)request.DadosPaciente;
            context.Pacientes.Add(novoPaciente);
            await context.SaveChangesAsync();

            request.DadosPaciente.IdPaciente = novoPaciente.IdPaciente;
            request.DadosErroMedicacao.IdPaciente = novoPaciente.IdPaciente;

            Notificadore novoNotificador = (Notificadore)request.DadosNotificador;
            context.Notificadores.Add(novoNotificador);
            await context.SaveChangesAsync();

            request.DadosNotificador.IdNotificador = novoNotificador.IdNotificador;
            request.DadosErroMedicacao.IdNotificador = novoNotificador.IdNotificador;

            if (request.DetalhesErros != null)
            {
                foreach (var detalhe in request.DetalhesErros)
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

            var erroEntidade = (ErrosMedicacao)request;

            context.ErrosMedicacaos.Add(erroEntidade);
            await context.SaveChangesAsync();

            return Ok("Erro de medicação registrado com sucesso.");
        }

        [HttpGet("GetTodosErrosMedicacao")]
        public async Task<IActionResult> GetTodosErrosMedicacao(int tipoIncidente)
        {
            var errosMedicacao = await context.Incidentes
                .Include(i => i.PacienteIdPacienteNavigation)
                .Include(i => i.NotificadorIdNotificadorNavigation)
                .Join(context.ErrosMedicacaos,
                    i => i.IdIncidente,
                    e => e.IdIncidente,
                    ErroMedicacaoResponseDto.MapeamentoGet()
                )
                .Where(e => e.DadosErroMedicacao.IdTipoIncidente == tipoIncidente)
                .ToListAsync();

            return Ok(errosMedicacao);
        }

        [HttpGet("GetErroMedicacaoPorId")]
        public async Task<IActionResult> GetErroMedicacaoPorId(int idIncidente, int tipoIncidente)
        {
            var erro = await context.Incidentes
                .Include(i => i.PacienteIdPacienteNavigation)
                .Include(i => i.NotificadorIdNotificadorNavigation)
                .Join(context.ErrosMedicacaos,
                    i => i.IdIncidente,
                    e => e.IdIncidente,
                    ErroMedicacaoResponseDto.MapeamentoGet()
                )
                .Where(e => e.DadosErroMedicacao.IdTipoIncidente == tipoIncidente
                         && e.DadosErroMedicacao.IdErroMedicacao == idIncidente)
                .FirstOrDefaultAsync();

            if (erro == null)
                return NotFound();

            return Ok(erro);
        }


        [HttpPut("AtualizarErroMedicacao/{idIncidente}")]
        public async Task<IActionResult> AtualizarErroMedicacao(int idIncidente, [FromBody] ErroMedicacaoResponseDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var incidente = await context.Incidentes
                .Include(i => i.PacienteIdPacienteNavigation)
                .FirstOrDefaultAsync(i => i.IdIncidente == idIncidente);

            if (incidente == null)
                return NotFound();

            var erroMed = await context.ErrosMedicacaos
                .Include(em => em.ErrosMedicacaoHasMedicamentos)
                .FirstOrDefaultAsync(em => em.IdIncidente == idIncidente);

            if (erroMed == null || incidente.PacienteIdPacienteNavigation == null)
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

            incidente.SetorIdSetor = request.DadosErroMedicacao.IdSetor;
            incidente.TipoIncidenteIdTipoIncidente = request.DadosErroMedicacao.IdTipoIncidente;
            incidente.NotificadorIdNotificador = notificador.IdNotificador;
            incidente.DataInicio = request.DadosErroMedicacao.DataInicio;
            incidente.DataFim = request.DadosErroMedicacao.DataFim;
            incidente.Descricao = request.DadosErroMedicacao.Descricao;
            incidente.DataNotificacao = request.DadosErroMedicacao.DataNotificacao;
            incidente.ClassificacaoIncidente = request.DadosErroMedicacao.ClassificacaoIncidente;
            incidente.ClassificacaoDano = request.DadosErroMedicacao.ClassificacaoDano;

            if (request.DetalhesErros != null)
            {
                foreach (var detalheDto in request.DetalhesErros)
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

                context.ErrosMedicacaoHasMedicamentos.RemoveRange(erroMed.ErrosMedicacaoHasMedicamentos);

                erroMed.ErrosMedicacaoHasMedicamentos = request.DetalhesErros.Select(d => new ErrosMedicacaoHasMedicamento
                {
                    ErroMedicacaoIdIncidente = idIncidente,
                    MedicamentoIdMedicamento = d.IdMedicamento!.Value,
                    Ocorrencia = d.Ocorrencia,
                    ResultouEfeitoNocivo = d.ResultouEfeitoNocivo,
                    DescricaoEfeitoNocivo = d.DescricaoEfeitoNocivo,
                    CausaErro = d.CausaErro,
                    DesfechoIdDesfecho = d.IdDesfecho,
                    ViaAdmIdViaAdm = d.IdViaAdm,
                    Posologia = d.Posologia,
                    DataInicioMed = d.DataInicioMed,
                    DataFimMed = d.DataFimMed,
                    Indicacao = d.Indicacao
                }).ToList();
            }

            await context.SaveChangesAsync();

            return NoContent();
        }


    }
}
