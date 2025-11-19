using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class FlebitesHasMedicamento
{
    public int FlebiteIdIncidente { get; set; }

    public int MedicamentoIdMedicamento { get; set; }

    public string? Diluente { get; set; }

    public string? ModoInfusao { get; set; }

    public virtual Flebite FlebiteIdIncidenteNavigation { get; set; } = null!;

    public virtual Medicamento MedicamentoIdMedicamentoNavigation { get; set; } = null!;
}
