using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class LocaisLesao
{
    public int IdLocalLesao { get; set; }

    public string DescricaoLocal { get; set; } = null!;

    public virtual ICollection<LesoesPressao> LesoesPressaos { get; set; } = new List<LesoesPressao>();
}
