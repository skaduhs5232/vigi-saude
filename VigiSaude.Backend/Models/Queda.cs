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

    public virtual ICollection<CategoriasmedicamentoquedaHasQueda> CategoriasmedicamentoquedaHasQueda { get; set; } = new List<CategoriasmedicamentoquedaHasQueda>();

    public virtual Incidente IdIncidenteNavigation { get; set; } = null!;

    public virtual Locaisquedum? LocalQuedaIdLocalQuedaNavigation { get; set; }

    public virtual Tiposquedum? TipoQuedaIdTipoQuedaNavigation { get; set; }

    public virtual ICollection<Fatoresriscoquedum> FatorRiscoQuedaIdFatorRiscoQueda { get; set; } = new List<Fatoresriscoquedum>();
}
