using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class ErrosMedicacaoHasMedicamento
{
    public int ErroMedicacaoIdIncidente { get; set; }

    public string? Ocorrencia { get; set; }

    public string? ResultouEfeitoNocivo { get; set; }

    public string? DescricaoEfeitoNocivo { get; set; }

    public string? CausaErro { get; set; }

    public int? DesfechoIdDesfecho { get; set; }

    public int MedicamentoIdMedicamento { get; set; }

    public int? ViaAdmIdViaAdm { get; set; }

    public string? Posologia { get; set; }

    public DateOnly? DataInicioMed { get; set; }

    public DateOnly? DataFimMed { get; set; }

    public string? Indicacao { get; set; }

    public virtual Desfecho? DesfechoIdDesfechoNavigation { get; set; }

    public virtual ErrosMedicacao ErroMedicacaoIdIncidenteNavigation { get; set; } = null!;

    public virtual Medicamento MedicamentoIdMedicamentoNavigation { get; set; } = null!;

    public virtual ViasAdm? ViaAdmIdViaAdmNavigation { get; set; }
}
