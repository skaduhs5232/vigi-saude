using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class TiposIncidente
{
    public int IdTipoIncidente { get; set; }

    public string DescricaoTipoIncidente { get; set; } = null!;

    public virtual ICollection<Incidente> Incidentes { get; set; } = new List<Incidente>();
}
