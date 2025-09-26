using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Desfecho
{
    public int IdDesfecho { get; set; }

    public string DescricaoDesfecho { get; set; } = null!;

    public virtual ICollection<ErrosmedicacaoHasMedicamento> ErrosmedicacaoHasMedicamentos { get; set; } = new List<ErrosmedicacaoHasMedicamento>();

    public virtual ICollection<RamHasMedicamento> RamHasMedicamentos { get; set; } = new List<RamHasMedicamento>();
}
