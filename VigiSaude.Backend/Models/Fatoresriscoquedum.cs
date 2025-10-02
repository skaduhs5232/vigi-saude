using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class FatoresRiscoQuedum
{
    public int IdFatorRiscoQueda { get; set; }

    public string DescricaoFator { get; set; } = null!;

    public virtual ICollection<Queda> QuedaIdIncidentes { get; set; } = new List<Queda>();
}
