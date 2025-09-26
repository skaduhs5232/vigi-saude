using System.Security.Principal;

namespace VigiSaude.Backend.Models.DTO.LesaoPressao;

public class LesaoPressaoDTO : IncideneteDTO
{
    public int? IdLesaoPressao { get; set; }
    public DateOnly? DataPrimeiraAvaliacao { get; set; }
    public string? ClassificacaoBraden { get; set; }
    public int? EscoreBraden { get; set; }
    public string? Reavaliacao48Horas { get; set; }
    public bool? MobilidadePrejudicada { get; set; }
    public string? ResponsavelAvaliacao { get; set; }
    public string? ResgistroSAE { get; set; }
    public bool? MudancaDecubito { get; set; }
    public int? IntervaloMudanca { get; set; }
    public string? TempoInternacaoLesao { get; set; }
    public int IdLocalLesao { get; set; }
    public string? DescicaoOutro { get; set; }
    public string? EstagioLesao { get; set; }
    public bool? SuperficeDinamicaApoio { get; set; }
    public bool? SolicitacaoAvaliacaoNutri { get; set; }
    public bool? RegistroAvaliacaoNutri { get; set; }
    public bool? RegistroavaliacaoFisio { get; set; }
    public bool? RegistroEnfermagem { get; set; }
    public string? UsoCoberturaAdequada { get; set; }
}
