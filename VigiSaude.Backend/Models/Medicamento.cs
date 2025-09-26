using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Medicamento
{
    public int IdMedicamento { get; set; }

    public string? NomeGenerico { get; set; }

    public string? Fabricante { get; set; }

    public string? Lote { get; set; }

    public DateOnly? Validade { get; set; }

    public virtual ICollection<ErrosmedicacaoHasMedicamento> ErrosmedicacaoHasMedicamentos { get; set; } = new List<ErrosmedicacaoHasMedicamento>();

    public virtual ICollection<FlebitesHasMedicamento> FlebitesHasMedicamentos { get; set; } = new List<FlebitesHasMedicamento>();

    public virtual ICollection<RamHasMedicamento> RamHasMedicamentos { get; set; } = new List<RamHasMedicamento>();
}
