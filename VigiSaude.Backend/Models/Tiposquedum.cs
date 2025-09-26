using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Tiposquedum
{
    public int IdTipoQueda { get; set; }

    public string DescricaoTipo { get; set; } = null!;

    public virtual ICollection<Queda> Queda { get; set; } = new List<Queda>();
}
