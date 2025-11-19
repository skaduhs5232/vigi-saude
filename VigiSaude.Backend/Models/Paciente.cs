using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Paciente
{
    public int IdPaciente { get; set; }

    public string Nome { get; set; } = null!;

    public string Prontuario { get; set; } = null!;

    public string? Leito { get; set; }

    public string? Sexo { get; set; }

    public decimal? Peso { get; set; }

    public DateOnly DataNascimento { get; set; }

    public TimeOnly? HoraNascimento { get; set; }

    public DateOnly? DataAdmissao { get; set; }

    public virtual ICollection<Incidente> Incidentes { get; set; } = new List<Incidente>();
}
