using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models.DTO.Flebite;


namespace VigiSaude.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlebiteController(VigisaudeDbContext context) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> RegistrarFlebite(FlebiteRequestDTO request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Paciente novoPaciente = (Paciente)request.DadosPaciente;
            context.Pacientes.Add(novoPaciente);
            await context.SaveChangesAsync();

            request.DadosPaciente.IdPaciente = novoPaciente.IdPaciente;
            request.DadosFlebite.IdPaciente = novoPaciente.IdPaciente;

            Notificadore novoNotificador = (Notificadore)request.DadosNotificador;
            context.Notificadores.Add(novoNotificador);
            await context.SaveChangesAsync();

            request.DadosNotificador.IdNotificador = novoNotificador.IdNotificador;
            request.DadosFlebite.IdNotificador = novoNotificador.IdNotificador;

            foreach (var medDto in request.Medicamentos ?? new())
            {
                if (medDto.IdMedicamento == 0)
                {
                    var novoMed = new Medicamento
                    {
                        NomeGenerico = medDto.NomeGenerico,
                        Fabricante = medDto.Fabricante,
                        Lote = medDto.Lote,
                        Validade = medDto.Validade
                    };
                    context.Medicamentos.Add(novoMed);
                    await context.SaveChangesAsync();

                    medDto.IdMedicamento = novoMed.IdMedicamento; 
                }
            }

            var novaFlebite = (Flebite)request;

            context.Flebites.Add(novaFlebite);
            await context.SaveChangesAsync();

            return Ok("Flebite registrada com sucesso.");
        }

        [HttpGet("GetTodasFlebites")]
        public async Task<IActionResult> GetTodasFlebites(int tipoIncidente)
        {
            var flebites = await context.Incidentes
            .Include(i => i.PacienteIdPacienteNavigation)
            .Include(i => i.NotificadorIdNotificadorNavigation)
            .Join(context.Flebites,
                i => i.IdIncidente,
                f => f.IdIncidente,
                FlebiteResponseDto.MapeamentoGet())
            .Where(f => f.DadosFlebite.IdTipoIncidente == tipoIncidente)
            .ToListAsync();

                return Ok(flebites);
        }

        [HttpGet("GetFlebitePorId")]
        public async Task<IActionResult> GetFlebitePorId(int idIncidente, int tipoIncidente)
        {
            var flebite = await context.Incidentes
                .Include(i => i.PacienteIdPacienteNavigation)
                .Include(i => i.NotificadorIdNotificadorNavigation)
                .Join(context.Flebites,
                    i => i.IdIncidente,
                    f => f.IdIncidente,
                    FlebiteResponseDto.MapeamentoGet())
                .Where(f => f.DadosFlebite.IdTipoIncidente == tipoIncidente
                         && f.DadosFlebite.IdFlebite == idIncidente)
                .FirstOrDefaultAsync();

            if (flebite == null)
                return NotFound();

            return Ok(flebite);
        }

        [HttpPut("AtualizarFlebite/{idIncidente}")]
        public async Task<IActionResult> AtualizarFlebite(int idIncidente, [FromBody] FlebiteResponseDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var incidente = await context.Incidentes
                .Include(i => i.PacienteIdPacienteNavigation)
                .FirstOrDefaultAsync(i => i.IdIncidente == idIncidente);

            if (incidente == null)
                return NotFound();

            var flebite = await context.Flebites
                .Include(f => f.FlebitesHasMedicamentos)
                .FirstOrDefaultAsync(f => f.IdIncidente == idIncidente);

            var notificador = await context.Notificadores
                .FirstOrDefaultAsync(n => n.IdNotificador == incidente.NotificadorIdNotificador);

            if (flebite == null || notificador == null || incidente.PacienteIdPacienteNavigation == null)
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

            incidente.SetorIdSetor = request.DadosFlebite.IdSetor;
            incidente.TipoIncidenteIdTipoIncidente = request.DadosFlebite.IdTipoIncidente;
            incidente.NotificadorIdNotificador = notificador.IdNotificador;
            incidente.DataInicio = request.DadosFlebite.DataInicio;
            incidente.DataFim = request.DadosFlebite.DataFim;
            incidente.Descricao = request.DadosFlebite.Descricao;
            incidente.DataNotificacao = request.DadosFlebite.DataNotificacao;
            incidente.ClassificacaoIncidente = request.DadosFlebite.ClassificacaoIncidente;
            incidente.ClassificacaoDano = request.DadosFlebite.ClassificacaoDano;

            flebite.Diagnóstico = request.DadosFlebite.Diagnostico;
            flebite.GrauFlebite = request.DadosFlebite.GrauFlebite;
            flebite.LocalPuncao = request.DadosFlebite.LocalPuncao;
            flebite.QtdPuncoesAteIncidente = request.DadosFlebite.QtdPuncoesAteIncidente;
            flebite.TipoCateter = request.DadosFlebite.TipoCateter;
            flebite.CalibreCateter = request.DadosFlebite.CalibreCateter;
            flebite.NumCateteresInseridos = request.DadosFlebite.NumCateteresInseridos;
            flebite.TempoPermanenciaAcesso = request.DadosFlebite.TempoPermanenciaAcesso;
            flebite.QtdMedVesicanteIrritante = request.DadosFlebite.QtdMedVesicanteIrritante;

            if (request.DadosFlebite.Medicamentos is not null)
            {
                foreach (var medDto in request.DadosFlebite.Medicamentos)
                {
                    if (medDto.IdMedicamento == 0)
                    {
                        var novoMed = new Medicamento
                        {
                            NomeGenerico = medDto.NomeGenerico,
                            Fabricante = medDto.Fabricante,
                            Lote = medDto.Lote,
                            Validade = medDto.Validade
                        };
                        context.Medicamentos.Add(novoMed);
                        await context.SaveChangesAsync();

                        medDto.IdMedicamento = novoMed.IdMedicamento;
                    }
                    else
                    {
                        var medExistente = await context.Medicamentos.FindAsync(medDto.IdMedicamento);
                        if (medExistente != null)
                        {
                            medExistente.NomeGenerico = medDto.NomeGenerico;
                            medExistente.Fabricante = medDto.Fabricante;
                            medExistente.Lote = medDto.Lote;
                            medExistente.Validade = medDto.Validade;
                        }
                    }
                }

                context.FlebitesHasMedicamentos.RemoveRange(flebite.FlebitesHasMedicamentos);

                flebite.FlebitesHasMedicamentos = request.DadosFlebite.Medicamentos.Select(m => new FlebitesHasMedicamento
                {
                    FlebiteIdIncidente = idIncidente,
                    MedicamentoIdMedicamento = m.IdMedicamento,
                    Diluente = m.Diluente,
                    ModoInfusao = m.ModoInfusao
                }).ToList();
            }

            await context.SaveChangesAsync();

            return NoContent();
        }

    }
}
