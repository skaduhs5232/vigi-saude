using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Locaislesao
{
    public int IdLocalLesao { get; set; }

    public string DescricaoLocal { get; set; } = null!;

    public virtual ICollection<Lesoespressao> Lesoespressaos { get; set; } = new List<Lesoespressao>();
}
