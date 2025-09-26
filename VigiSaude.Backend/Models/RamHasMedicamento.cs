using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class RamHasMedicamento
{
    public int RamIdIncidente { get; set; }

    public int? ViaAdmIdViaAdm { get; set; }

    public int? DesfechoIdDesfecho { get; set; }

    public string? AcaoAdotada { get; set; }

    public int MedicamentoIdMedicamento { get; set; }

    public bool? MedProvavelCausador { get; set; }

    public string? Posologia { get; set; }

    public string? Indicacao { get; set; }

    public string? DataInicioMed { get; set; }

    public string? DataFimMed { get; set; }

    public virtual Desfecho? DesfechoIdDesfechoNavigation { get; set; }

    public virtual Medicamento MedicamentoIdMedicamentoNavigation { get; set; } = null!;

    public virtual Ram RamIdIncidenteNavigation { get; set; } = null!;

    public virtual Viasadm? ViaAdmIdViaAdmNavigation { get; set; }
}
