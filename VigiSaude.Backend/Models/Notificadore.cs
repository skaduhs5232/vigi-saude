using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Notificadore
{
    public int IdNotificador { get; set; }

    public string? Nome { get; set; }

    public string? CategoriaProfissional { get; set; }

    public string? Telefone { get; set; }

    public string? Email { get; set; }

    public int? SetorIdSetor { get; set; }

    public bool FuncionarioGerenciaRisco { get; set; }

    public virtual ICollection<Incidente> Incidentes { get; set; } = new List<Incidente>();

    public virtual Setore? SetorIdSetorNavigation { get; set; }
}
