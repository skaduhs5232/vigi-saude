using System;
using System.Collections.Generic;
using VigiSaude.Backend.Models.DTO;

namespace VigiSaude.Backend.Models.DTO.Queda
{
    public class QuedaDto : IncideneteDto
    {
        public int? IdQueda { get; set; }

        public string? Diagnostico { get; set; }
        public bool? AvaliacaoRiscoAdmissao { get; set; }
        public bool? RegistroOrientacaoProntuario { get; set; }
        public bool? RiscoIdentificadoAdmissao { get; set; }
        public bool? PacienteComAcompanhante { get; set; }

        public int? QtdMedBaixoRisco { get; set; }
        public int? QtdMedMedioRisco { get; set; }
        public int? QtdMedAltoRisco { get; set; }

        public int? TipoQuedaId { get; set; }
        public int? LocalQuedaId { get; set; }

        public TimeOnly? Horario { get; set; }
        public string? Turno { get; set; }
        public string? Desfecho { get; set; }
        public List<CategoriaMedicamentoQuedaDto>? CategoriasMedicamento { get; set; }
        public List<FatorRiscoQuedaDto>? FatoresRisco { get; set; }
    }

    // DTO auxiliar para a categoria de medicamento relacionada à queda.
    public class CategoriaMedicamentoQuedaDto
    {
        public int IdCategoriaMedicamentoQueda { get; set; }
        public string? DescricaoCategoria { get; set; }
        public string? DescricaoMeds { get; set; }
    }

    // DTO auxiliar para os fatores de risco relacionados à queda.
    public class FatorRiscoQuedaDto
    {
        public int IdFatorRiscoQueda { get; set; }
        public string? DescricaoFator { get; set; }
    }
}



