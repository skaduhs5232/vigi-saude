using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Flebite
{
    public int IdIncidente { get; set; }

    public string? Diagnóstico { get; set; }

    public string? GrauFlebite { get; set; }

    public string? LocalPuncao { get; set; }

    public int? QtdPuncoesAteIncidente { get; set; }

    public string? TipoCateter { get; set; }

    public string? CalibreCateter { get; set; }

    public int? NumCateteresInseridos { get; set; }

    public decimal? TempoPermanenciaAcesso { get; set; }

    public int? QtdMedVesicanteIrritante { get; set; }

    public virtual ICollection<FlebitesHasMedicamento> FlebitesHasMedicamentos { get; set; } = new List<FlebitesHasMedicamento>();

    public virtual Incidente IdIncidenteNavigation { get; set; } = null!;
}
