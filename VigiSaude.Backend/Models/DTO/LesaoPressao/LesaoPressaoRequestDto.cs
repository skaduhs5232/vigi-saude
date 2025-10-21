using System.Linq.Expressions;
using System.Security.Principal;
using VigiSaude.Backend.Models.DTO.NotificadorDTO;
using VigiSaude.Backend.Models.DTO.PacienteDTO;

namespace VigiSaude.Backend.Models.DTO.LesaoPressao;

public class LesaoPressaoRequestDto
{
    public required PatienteInfoDto DadosPaciente { get; set; }
    public required LesaoPressaoDto DadosLesaoPressao { get; set; }
    public required NotificadorInfoDto DadosNotificador { get; set; }

    public static explicit operator LesoesPressao(LesaoPressaoRequestDto request)
    {
        return new LesoesPressao
        {
            IdIncidenteNavigation = new Incidente
            {
                PacienteIdPaciente = (int)request.DadosPaciente.IdPaciente!,
                SetorIdSetor = request.DadosLesaoPressao.IdSetor,
                TipoIncidenteIdTipoIncidente = request.DadosLesaoPressao.IdTipoIncidente,
                NotificadorIdNotificador = (int)request.DadosLesaoPressao.IdNotificador!,
                DataInicio = request.DadosLesaoPressao.DataInicio,
                DataFim = request.DadosLesaoPressao.DataFim,
                Descricao = request.DadosLesaoPressao.Descricao,
                DataNotificacao = request.DadosLesaoPressao.DataNotificacao,
                ClassificacaoIncidente = request.DadosLesaoPressao.ClassificacaoIncidente,
                ClassificacaoDano = request.DadosLesaoPressao.ClassificacaoDano,
            },
            DataPrimeiraAvaliacao = request.DadosLesaoPressao.DataPrimeiraAvaliacao,
            ClassificacaoBraden = request.DadosLesaoPressao.ClassificacaoBraden,
            EscoreBraden = request.DadosLesaoPressao.EscoreBraden,
            Reavaliacao48h = request.DadosLesaoPressao.Reavaliacao48Horas,
            MobilidadePrejudicada = request.DadosLesaoPressao.MobilidadePrejudicada,
            ResponsávelAvaliacao = request.DadosLesaoPressao.ResponsavelAvaliacao,
            RegistroSae = request.DadosLesaoPressao.ResgistroSAE,
            MudancaDecubito = request.DadosLesaoPressao.MudancaDecubito,
            IntervaloMudanca = request.DadosLesaoPressao.IntervaloMudanca,
            TempoInternacaoAteLesao = request.DadosLesaoPressao.TempoInternacaoLesao,
            LocalLesaoIdLocalLesao = request.DadosLesaoPressao.IdLesaoPressao,
            DescricaoOutro = request.DadosLesaoPressao.DescicaoOutro,
            EstagioLesao = request.DadosLesaoPressao.EstagioLesao,
            SuperficieDinamicaApoio = request.DadosLesaoPressao.SuperficeDinamicaApoio,
            SolicitacaoAvaliacaoNutri = request.DadosLesaoPressao.SolicitacaoAvaliacaoNutri,
            RegistroAvaliacaoNutri = request.DadosLesaoPressao.RegistroAvaliacaoNutri,
            RegistroAvaliacaoFisio = request.DadosLesaoPressao.RegistroavaliacaoFisio,
            RegistroEnfermagem = request.DadosLesaoPressao.RegistroEnfermagem,
            UsoCoberturaAdequada = request.DadosLesaoPressao.UsoCoberturaAdequada,
        };
    }
}
