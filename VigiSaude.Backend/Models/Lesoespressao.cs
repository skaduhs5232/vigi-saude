using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class LesoesPressao
{
    public int IdIncidente { get; set; }

    public DateOnly? DataPrimeiraAvaliacao { get; set; }

    public string? ClassificacaoBraden { get; set; }

    public int? EscoreBraden { get; set; }

    public string? Reavaliacao48h { get; set; }

    public bool? MobilidadePrejudicada { get; set; }

    public string? ResponsávelAvaliacao { get; set; }

    public string? RegistroSae { get; set; }

    public bool? MudancaDecubito { get; set; }

    public int? IntervaloMudanca { get; set; }

    public string? TempoInternacaoAteLesao { get; set; }

    public int? LocalLesaoIdLocalLesao { get; set; }

    public string? DescricaoOutro { get; set; }

    public string? EstagioLesao { get; set; }

    public bool? SuperficieDinamicaApoio { get; set; }

    public bool? SolicitacaoAvaliacaoNutri { get; set; }

    public bool? RegistroAvaliacaoNutri { get; set; }

    public bool? RegistroAvaliacaoFisio { get; set; }

    public bool? RegistroEnfermagem { get; set; }

    public string? UsoCoberturaAdequada { get; set; }

    public virtual Incidente IdIncidenteNavigation { get; set; } = null!;

    public virtual LocaisLesao? LocalLesaoIdLocalLesaoNavigation { get; set; }
}
