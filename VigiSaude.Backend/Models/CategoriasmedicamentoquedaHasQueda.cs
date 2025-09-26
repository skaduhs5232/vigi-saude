using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class CategoriasmedicamentoquedaHasQueda
{
    public int CategoriaMedicamentoQuedaIdCategoriaMedicamentoQueda { get; set; }

    public int QuedaIdIncidente { get; set; }

    public string? DescricaoMeds { get; set; }

    public virtual Categoriasmedicamentoquedum CategoriaMedicamentoQuedaIdCategoriaMedicamentoQuedaNavigation { get; set; } = null!;

    public virtual Queda QuedaIdIncidenteNavigation { get; set; } = null!;
}
