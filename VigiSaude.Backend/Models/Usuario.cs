using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Usuario
{
    public int IdUsuarios { get; set; }

    public string NomeUsuario { get; set; } = null!;

    public string Senha { get; set; } = null!;
}
