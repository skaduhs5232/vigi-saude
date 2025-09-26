using VigiSaude.Backend.Models.DTO.PacienteDTO;

namespace VigiSaude.Backend.Models.DTO.LesaoPressao;

public class RequestNovaLesaoPressaoDTO
{
    public required PatienteInfoDto Paciente { get; set; }
    public required LesaoPressaoDTO LesaoPressao { get; set; }

    public static explicit operator Lesoespressao(RequestNovaLesaoPressaoDTO request)
    {
        return new Lesoespressao
        {
            IdIncidenteNavigation = new Incidente
            {
                PacienteIdPaciente = (int)request.Paciente.IdPaciente!,
                SetorIdSetor = request.LesaoPressao.IdSetor,
                TipoIncidenteIdTipoIncidente = request.LesaoPressao.IdTipoIncidente,
                NotificadorIdNotificador = request.LesaoPressao.IdNotificador,
                DataInicio = request.LesaoPressao.DataInicio,
                DataFim = request.LesaoPressao.DataFim,
                Descricao = request.LesaoPressao.Descricao,
                DataNotificacao = request.LesaoPressao.DataNotificacao,
                ClassificacaoIncidente = request.LesaoPressao.ClassificacaoIncidente,
                ClassificacaoDano = request.LesaoPressao.ClassificacaoDano
            },
            DataPrimeiraAvaliacao = request.LesaoPressao.DataPrimeiraAvaliacao,
            ClassificacaoBraden = request.LesaoPressao.ClassificacaoBraden,
            EscoreBraden = request.LesaoPressao.EscoreBraden,
            Reavaliacao48h = request.LesaoPressao.Reavaliacao48Horas,
            MobilidadePrejudicada = request.LesaoPressao.MobilidadePrejudicada,
            ResponsávelAvaliacao = request.LesaoPressao.ResponsavelAvaliacao,
            RegistroSae = request.LesaoPressao.ResgistroSAE,
            MudancaDecubito = request.LesaoPressao.MudancaDecubito,
            IntervaloMudanca = request.LesaoPressao.IntervaloMudanca,
            TempoInternacaoAteLesao = request.LesaoPressao.TempoInternacaoLesao,
            LocalLesaoIdLocalLesao = request.LesaoPressao.IdLesaoPressao,
            DescricaoOutro = request.LesaoPressao.DescicaoOutro,
            EstagioLesao = request.LesaoPressao.EstagioLesao,
            SuperficieDinamicaApoio = request.LesaoPressao.SuperficeDinamicaApoio,
            SolicitacaoAvaliacaoNutri = request.LesaoPressao.SolicitacaoAvaliacaoNutri,
            RegistroAvaliacaoNutri = request.LesaoPressao.RegistroAvaliacaoNutri,
            RegistroAvaliacaoFisio = request.LesaoPressao.RegistroavaliacaoFisio,
            RegistroEnfermagem = request.LesaoPressao.RegistroEnfermagem,
            UsoCoberturaAdequada = request.LesaoPressao.UsoCoberturaAdequada,
        };
    }
}
