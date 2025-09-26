using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Errosmedicacao
{
    public int IdIncidente { get; set; }

    public virtual ICollection<ErrosmedicacaoHasMedicamento> ErrosmedicacaoHasMedicamentos { get; set; } = new List<ErrosmedicacaoHasMedicamento>();

    public virtual Incidente IdIncidenteNavigation { get; set; } = null!;
}
