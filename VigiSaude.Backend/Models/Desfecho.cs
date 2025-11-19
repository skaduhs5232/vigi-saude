using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Desfecho
{
    public int IdDesfecho { get; set; }

    public string DescricaoDesfecho { get; set; } = null!;

    public virtual ICollection<ErrosMedicacaoHasMedicamento> ErrosMedicacaoHasMedicamentos { get; set; } = new List<ErrosMedicacaoHasMedicamento>();

    public virtual ICollection<RamHasMedicamento> RamHasMedicamentos { get; set; } = new List<RamHasMedicamento>();
}
