using System.Linq.Expressions;
using VigiSaude.Backend.Models.DTO;
using VigiSaude.Backend.Models.DTO.NotificadorDTO;
using VigiSaude.Backend.Models.DTO.PacienteDTO;

namespace VigiSaude.Backend.Models.DTO.LesaoPressao;

public class LesaoPressaoResponseDto
{
    public PatienteInfoDto DadosPaciente { get; set; } = default!;
    public LesaoPressaoDto DadosLesaoPressao { get; set; } = default!;
    public NotificadorInfoDto DadosNotificador { get; set; } = default!;

    public static Expression<Func<Incidente, LesoesPressao, LesaoPressaoResponseDto>> MapeamentoGet()
    {
        return (i, lp) => new LesaoPressaoResponseDto
        {
            DadosPaciente = new PatienteInfoDto
            {
                IdPaciente = i.PacienteIdPacienteNavigation.IdPaciente,
                Nome = i.PacienteIdPacienteNavigation.Nome,
                Protuario = i.PacienteIdPacienteNavigation.Prontuario,
                Leito = i.PacienteIdPacienteNavigation.Leito,
                Sexo = i.PacienteIdPacienteNavigation.Sexo,
                Peso = i.PacienteIdPacienteNavigation.Peso,
                DataNascimento = i.PacienteIdPacienteNavigation.DataNascimento,
                HoraNascimento = i.PacienteIdPacienteNavigation.HoraNascimento,
                DataAdmissao = i.PacienteIdPacienteNavigation.DataAdmissao
            },
            DadosLesaoPressao = new LesaoPressaoDto
            {
                IdLesaoPressao = lp.IdIncidente,
                IdSetor = i.SetorIdSetor,
                IdTipoIncidente = i.TipoIncidenteIdTipoIncidente,
                IdNotificador = i.NotificadorIdNotificador,
                DataInicio = i.DataInicio,
                Descricao = i.Descricao,
                IdPaciente = i.PacienteIdPaciente,
                DataFim = i.DataFim,
                DataNotificacao = i.DataNotificacao,
                ClassificacaoIncidente = i.ClassificacaoIncidente,
                ClassificacaoDano = i.ClassificacaoDano,
                ClassificacaoBraden = lp.ClassificacaoBraden,
                EscoreBraden = lp.EscoreBraden,
                Reavaliacao48Horas = lp.Reavaliacao48h,
                MobilidadePrejudicada = lp.MobilidadePrejudicada,
                ResponsavelAvaliacao = lp.ResponsávelAvaliacao,
                ResgistroSAE = lp.RegistroSae,
                MudancaDecubito = lp.MudancaDecubito,
                IntervaloMudanca = lp.IntervaloMudanca,
                DescicaoOutro = lp.DescricaoOutro,
                EstagioLesao = lp.EstagioLesao,
                RegistroavaliacaoFisio = lp.RegistroAvaliacaoFisio,
                RegistroEnfermagem = lp.RegistroEnfermagem,
                UsoCoberturaAdequada = lp.UsoCoberturaAdequada,
            },
            DadosNotificador = new NotificadorInfoDto
            {
                IdNotificador = i.NotificadorIdNotificador,
                FuncionarioGerenciaRisco = i.NotificadorIdNotificadorNavigation.FuncionarioGerenciaRisco,
                Nome = i.NotificadorIdNotificadorNavigation.Nome,
                Email = i.NotificadorIdNotificadorNavigation.Email,
                Telefone = i.NotificadorIdNotificadorNavigation.Telefone,
                Categoria = i.NotificadorIdNotificadorNavigation.CategoriaProfissional,
                Setor = i.NotificadorIdNotificadorNavigation.SetorIdSetor
            }
        };
    }
}
