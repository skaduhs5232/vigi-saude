using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models;

public partial class Incidente
{
    public int IdIncidente { get; set; }

    public int PacienteIdPaciente { get; set; }

    public int SetorIdSetor { get; set; }

    public int TipoIncidenteIdTipoIncidente { get; set; }

    public int NotificadorIdNotificador { get; set; }

    public DateOnly DataInicio { get; set; }

    public DateOnly? DataFim { get; set; }

    public string Descricao { get; set; } = null!;

    public DateOnly? DataNotificacao { get; set; }

    public string? ClassificacaoIncidente { get; set; }

    public string? ClassificacaoDano { get; set; }

    public virtual ErrosMedicacao? ErrosMedicacao { get; set; }

    public virtual Flebite? Flebite { get; set; }

    public virtual LesoesPressao? LesoesPressao { get; set; }

    public virtual Notificadore NotificadorIdNotificadorNavigation { get; set; } = null!;

    public virtual Paciente PacienteIdPacienteNavigation { get; set; } = null!;

    public virtual Queda? Queda { get; set; }

    public virtual Ram? Ram { get; set; }

    public virtual Setore SetorIdSetorNavigation { get; set; } = null!;

    public virtual TiposIncidente TipoIncidenteIdTipoIncidenteNavigation { get; set; } = null!;
}
