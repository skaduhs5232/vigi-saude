using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Queda
{
    public int IdIncidente { get; set; }

    public string? Diagnostico { get; set; }

    public bool? AvaliacaoRiscoAdmissao { get; set; }

    public bool? RegistroOrientacaoProntuario { get; set; }

    public bool? RiscoIdentificadoAdmissao { get; set; }

    public bool? PacienteComAcompanhante { get; set; }

    public int? QtdMedBaixoRisco { get; set; }

    public int? QtdMedMedioRisco { get; set; }

    public int? QtdMedAltoRisco { get; set; }

    public int? TipoQuedaIdTipoQueda { get; set; }

    public int? LocalQuedaIdLocalQueda { get; set; }

    public TimeOnly? Horario { get; set; }

    public string? Turno { get; set; }

    public string? Desfecho { get; set; }

    public virtual ICollection<CategoriasMedicamentoQuedaHasQueda> CategoriasMedicamentoQuedaHasQueda { get; set; } = new List<CategoriasMedicamentoQuedaHasQueda>();

    public virtual Incidente IdIncidenteNavigation { get; set; } = null!;

    public virtual LocaisQuedum? LocalQuedaIdLocalQuedaNavigation { get; set; }

    public virtual TiposQuedum? TipoQuedaIdTipoQuedaNavigation { get; set; }

    public virtual ICollection<FatoresRiscoQuedum> FatorRiscoQuedaIdFatorRiscoQueda { get; set; } = new List<FatoresRiscoQuedum>();
}
