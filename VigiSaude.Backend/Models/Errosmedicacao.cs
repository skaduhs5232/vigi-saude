using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class ErrosMedicacao
{
    public int IdIncidente { get; set; }

    public virtual ICollection<ErrosMedicacaoHasMedicamento> ErrosMedicacaoHasMedicamentos { get; set; } = new List<ErrosMedicacaoHasMedicamento>();

    public virtual Incidente IdIncidenteNavigation { get; set; } = null!;
}
