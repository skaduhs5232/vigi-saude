using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Categoriasmedicamentoquedum
{
    public int IdCategoriaMedicamentoQueda { get; set; }

    public string DescricaoCatMedQueda { get; set; } = null!;

    public virtual ICollection<CategoriasmedicamentoquedaHasQueda> CategoriasmedicamentoquedaHasQueda { get; set; } = new List<CategoriasmedicamentoquedaHasQueda>();
}
