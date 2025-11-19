using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class ViasAdm
{
    public int IdViaAdm { get; set; }

    public string DescricaoVia { get; set; } = null!;

    public virtual ICollection<ErrosMedicacaoHasMedicamento> ErrosMedicacaoHasMedicamentos { get; set; } = new List<ErrosMedicacaoHasMedicamento>();

    public virtual ICollection<RamHasMedicamento> RamHasMedicamentos { get; set; } = new List<RamHasMedicamento>();
}
