using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Setore
{
    public int IdSetor { get; set; }

    public string DescricaoSetor { get; set; } = null!;

    public virtual ICollection<Incidente> Incidentes { get; set; } = new List<Incidente>();

    public virtual ICollection<Notificadore> Notificadores { get; set; } = new List<Notificadore>();
}
