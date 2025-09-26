using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Locaisquedum
{
    public int IdLocalQueda { get; set; }

    public string DescricaoLocal { get; set; } = null!;

    public virtual ICollection<Queda> Queda { get; set; } = new List<Queda>();
}
