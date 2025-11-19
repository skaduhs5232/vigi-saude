using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Ram
{
    public int IdIncidente { get; set; }

    public virtual Incidente IdIncidenteNavigation { get; set; } = null!;

    public virtual ICollection<RamHasMedicamento> RamHasMedicamentos { get; set; } = new List<RamHasMedicamento>();
}
