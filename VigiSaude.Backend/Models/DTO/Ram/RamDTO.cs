using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models.DTO.Ram
{
    public class RamDto : IncideneteDto
    {
        public int? IdRam { get; set; }
    }

    public class RamDetalheDto
    {
        public int? IdMedicamento { get; set; }
        public string? NomeGenerico { get; set; }
        public string? Fabricante { get; set; }
        public string? Lote { get; set; }
        public DateOnly? Validade { get; set; }

        public string? AcaoAdotada { get; set; }
        public bool? MedProvavelCausador { get; set; }
        public string? Posologia { get; set; }
        public string? Indicacao { get; set; }
        public DateOnly? DataInicioMed { get; set; }
        public DateOnly? DataFimMed { get; set; }

        public int? IdDesfecho { get; set; }
        public string? DescricaoDesfecho { get; set; }

        public int? IdViaAdm { get; set; }
        public string? DescricaoViaAdm { get; set; }
    }
}
