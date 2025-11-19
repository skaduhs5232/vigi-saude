using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.LesaoPressao;

namespace VigiSaude.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LesaoPressaoController(VigisaudeDbContext context) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> RegistrarLesaoPressao(LesaoPressaoRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        Paciente novoPaciente = (Paciente)request.DadosPaciente;
        context.Pacientes.Add(novoPaciente);
        context.SaveChanges();
        request.DadosPaciente.IdPaciente = novoPaciente.IdPaciente;
        request.DadosLesaoPressao.IdPaciente = novoPaciente.IdPaciente;

        Notificadore novoNotificador = (Notificadore)request.DadosNotificador;
        context.Notificadores.Add(novoNotificador);
        context.SaveChanges();
        request.DadosNotificador.IdNotificador = novoNotificador.IdNotificador;
        request.DadosLesaoPressao.IdNotificador = novoNotificador.IdNotificador;

        await context.LesoesPressaos.AddAsync((LesoesPressao)request);
        await context.SaveChangesAsync();

        return Ok(ModelState);
    }

    [HttpGet("GetTodasLesoesPressao")]
    public async Task<IActionResult> GetTodasLesoesPressao(int tipoincidente)
    {
        var lesoes = await context.Incidentes
            .Include(i => i.PacienteIdPacienteNavigation)
            .Include(i => i.NotificadorIdNotificadorNavigation)
            .Join(context.LesoesPressaos,
                i => i.IdIncidente,
                lp => lp.IdIncidente,
                LesaoPressaoResponseDto.MapeamentoGet())
            .Where(i => i.DadosLesaoPressao.IdTipoIncidente == tipoincidente)
            .ToListAsync();

        return Ok(lesoes);
    }

    [HttpGet("GetLesaoPressaoPorId")]
    public async Task<IActionResult> GetLesaoPressaoPorId(int idIncidente, int tipoincidente)
    {
        var lesao = await context.Incidentes
            .Include(i => i.PacienteIdPacienteNavigation)
            .Include(i => i.NotificadorIdNotificadorNavigation)
            .Join(context.LesoesPressaos,
                i => i.IdIncidente,
                lp => lp.IdIncidente,
                LesaoPressaoResponseDto.MapeamentoGet())
            .Where(i => i.DadosLesaoPressao.IdTipoIncidente == tipoincidente 
                    && i.DadosLesaoPressao.IdLesaoPressao == idIncidente)
            .ToListAsync();

        if (lesao == null)
            return NotFound();

        return Ok(lesao);
    }

    [HttpPut("AtualizarLesaoPressao/{idIncidente}")]
    public async Task<IActionResult> AtualizarLesaoPressao(int idIncidente, [FromBody] LesaoPressaoRequestDto request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var incidente = await context.Incidentes
            .Include(i => i.PacienteIdPacienteNavigation)
            .FirstOrDefaultAsync(i => i.IdIncidente == idIncidente);

        if (incidente == null)
            return NotFound();

        var lesao = await context.LesoesPressaos
            .FirstOrDefaultAsync(lp => lp.IdIncidente == idIncidente);

        var notificador = await context.Notificadores
            .FirstOrDefaultAsync(n => n.IdNotificador == incidente.NotificadorIdNotificador);

        if (lesao == null || notificador == null || incidente.PacienteIdPacienteNavigation == null)
            return NotFound();

        incidente.PacienteIdPacienteNavigation.Nome = request.DadosPaciente.Nome;
        incidente.PacienteIdPacienteNavigation.Prontuario = request.DadosPaciente.Protuario;
        incidente.PacienteIdPacienteNavigation.Leito = request.DadosPaciente.Leito;
        incidente.PacienteIdPacienteNavigation.Sexo = request.DadosPaciente.Sexo;
        incidente.PacienteIdPacienteNavigation.Peso = request.DadosPaciente.Peso;
        incidente.PacienteIdPacienteNavigation.DataNascimento = request.DadosPaciente.DataNascimento;
        incidente.PacienteIdPacienteNavigation.HoraNascimento = request.DadosPaciente.HoraNascimento;
        incidente.PacienteIdPacienteNavigation.DataAdmissao = request.DadosPaciente.DataAdmissao;

        notificador.Nome = request.DadosNotificador.Nome;
        notificador.Email = request.DadosNotificador.Email;
        notificador.Telefone = request.DadosNotificador.Telefone;
        notificador.CategoriaProfissional = request.DadosNotificador.Categoria;
        notificador.SetorIdSetor = request.DadosNotificador.Setor;
        notificador.FuncionarioGerenciaRisco = request.DadosNotificador.FuncionarioGerenciaRisco;

        incidente.SetorIdSetor = request.DadosLesaoPressao.IdSetor;
        incidente.TipoIncidenteIdTipoIncidente = request.DadosLesaoPressao.IdTipoIncidente;
        incidente.NotificadorIdNotificador = notificador.IdNotificador;
        incidente.DataInicio = request.DadosLesaoPressao.DataInicio;
        incidente.DataFim = request.DadosLesaoPressao.DataFim;
        incidente.Descricao = request.DadosLesaoPressao.Descricao;
        incidente.DataNotificacao = request.DadosLesaoPressao.DataNotificacao;
        incidente.ClassificacaoIncidente = request.DadosLesaoPressao.ClassificacaoIncidente;
        incidente.ClassificacaoDano = request.DadosLesaoPressao.ClassificacaoDano;

        lesao.ClassificacaoBraden = request.DadosLesaoPressao.ClassificacaoBraden;
        lesao.EscoreBraden = request.DadosLesaoPressao.EscoreBraden;
        lesao.Reavaliacao48h = request.DadosLesaoPressao.Reavaliacao48Horas;
        lesao.MobilidadePrejudicada = request.DadosLesaoPressao.MobilidadePrejudicada;
        lesao.ResponsávelAvaliacao = request.DadosLesaoPressao.ResponsavelAvaliacao;
        lesao.RegistroSae = request.DadosLesaoPressao.ResgistroSAE;
        lesao.MudancaDecubito = request.DadosLesaoPressao.MudancaDecubito;
        lesao.IntervaloMudanca = request.DadosLesaoPressao.IntervaloMudanca;
        lesao.TempoInternacaoAteLesao = request.DadosLesaoPressao.TempoInternacaoLesao;
        lesao.LocalLesaoIdLocalLesao = request.DadosLesaoPressao.IdLocalLesao;
        lesao.DescricaoOutro = request.DadosLesaoPressao.DescicaoOutro;
        lesao.EstagioLesao = request.DadosLesaoPressao.EstagioLesao;
        lesao.SuperficieDinamicaApoio = request.DadosLesaoPressao.SuperficeDinamicaApoio;
        lesao.SolicitacaoAvaliacaoNutri = request.DadosLesaoPressao.SolicitacaoAvaliacaoNutri;
        lesao.RegistroAvaliacaoNutri = request.DadosLesaoPressao.RegistroAvaliacaoNutri;
        lesao.RegistroAvaliacaoFisio = request.DadosLesaoPressao.RegistroavaliacaoFisio;
        lesao.RegistroEnfermagem = request.DadosLesaoPressao.RegistroEnfermagem;
        lesao.UsoCoberturaAdequada = request.DadosLesaoPressao.UsoCoberturaAdequada;

        await context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("ExcluirLesaoPressao/{idIncidente}")]
    public async Task<IActionResult> ExcluirLesaoPressao(int idIncidente)
    {
        var lesao = await context.LesoesPressaos.FirstOrDefaultAsync(lp => lp.IdIncidente == idIncidente);
        if (lesao == null)
            return NotFound();

        context.LesoesPressaos.Remove(lesao);

        var incidente = await context.Incidentes.FirstOrDefaultAsync(i => i.IdIncidente == idIncidente);
        if (incidente != null)
            context.Incidentes.Remove(incidente);

        await context.SaveChangesAsync();
        return NoContent();
    }
}
