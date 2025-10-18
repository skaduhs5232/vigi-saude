using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class CategoriasMedicamentoQuedum
{
    public int IdCategoriaMedicamentoQueda { get; set; }

    public string? DescricaoCatMedQueda { get; set; }

    public virtual ICollection<CategoriasMedicamentoQuedaHasQueda> CategoriasMedicamentoQuedaHasQueda { get; set; } = new List<CategoriasMedicamentoQuedaHasQueda>();
}
