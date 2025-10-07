using System.Linq.Expressions;
using System.Security.Principal;
using VigiSaude.Backend.Models.DTO.NotificadorDTO;
using VigiSaude.Backend.Models.DTO.PacienteDTO;

namespace VigiSaude.Backend.Models.DTO.LesaoPressao;

public class LesaoPressaoRequestDto
{
    public required PatienteInfoDto DadosPaciente { get; set; }
    public required LesaoPressaoDto DadosLesaoPresao { get; set; }
    public required NotificadorInfoDto DadosNotificador { get; set; }

    public static explicit operator LesoesPressao(LesaoPressaoRequestDto request)
    {
        return new LesoesPressao
        {
            IdIncidenteNavigation = new Incidente
            {
                PacienteIdPaciente = (int)request.DadosPaciente.IdPaciente!,
                SetorIdSetor = request.DadosLesaoPresao.IdSetor,
                TipoIncidenteIdTipoIncidente = request.DadosLesaoPresao.IdTipoIncidente,
                NotificadorIdNotificador = request.DadosLesaoPresao.IdNotificador,
                DataInicio = request.DadosLesaoPresao.DataInicio,
                DataFim = request.DadosLesaoPresao.DataFim,
                Descricao = request.DadosLesaoPresao.Descricao,
                DataNotificacao = request.DadosLesaoPresao.DataNotificacao,
                ClassificacaoIncidente = request.DadosLesaoPresao.ClassificacaoIncidente,
                ClassificacaoDano = request.DadosLesaoPresao.ClassificacaoDano,
            },
            DataPrimeiraAvaliacao = request.DadosLesaoPresao.DataPrimeiraAvaliacao,
            ClassificacaoBraden = request.DadosLesaoPresao.ClassificacaoBraden,
            EscoreBraden = request.DadosLesaoPresao.EscoreBraden,
            Reavaliacao48h = request.DadosLesaoPresao.Reavaliacao48Horas,
            MobilidadePrejudicada = request.DadosLesaoPresao.MobilidadePrejudicada,
            ResponsávelAvaliacao = request.DadosLesaoPresao.ResponsavelAvaliacao,
            RegistroSae = request.DadosLesaoPresao.ResgistroSAE,
            MudancaDecubito = request.DadosLesaoPresao.MudancaDecubito,
            IntervaloMudanca = request.DadosLesaoPresao.IntervaloMudanca,
            TempoInternacaoAteLesao = request.DadosLesaoPresao.TempoInternacaoLesao,
            LocalLesaoIdLocalLesao = request.DadosLesaoPresao.IdLesaoPressao,
            DescricaoOutro = request.DadosLesaoPresao.DescicaoOutro,
            EstagioLesao = request.DadosLesaoPresao.EstagioLesao,
            SuperficieDinamicaApoio = request.DadosLesaoPresao.SuperficeDinamicaApoio,
            SolicitacaoAvaliacaoNutri = request.DadosLesaoPresao.SolicitacaoAvaliacaoNutri,
            RegistroAvaliacaoNutri = request.DadosLesaoPresao.RegistroAvaliacaoNutri,
            RegistroAvaliacaoFisio = request.DadosLesaoPresao.RegistroavaliacaoFisio,
            RegistroEnfermagem = request.DadosLesaoPresao.RegistroEnfermagem,
            UsoCoberturaAdequada = request.DadosLesaoPresao.UsoCoberturaAdequada,
        };
    }
}
