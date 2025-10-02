using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class CategoriasMedicamentoQuedaHasQueda
{
    public int CategoriaMedicamentoQuedaIdCategoriaMedicamentoQueda { get; set; }

    public int QuedaIdIncidente { get; set; }

    public string? DescricaoMeds { get; set; }

    public virtual CategoriasMedicamentoQuedum CategoriaMedicamentoQuedaIdCategoriaMedicamentoQuedaNavigation { get; set; } = null!;

    public virtual Queda QuedaIdIncidenteNavigation { get; set; } = null!;
}
