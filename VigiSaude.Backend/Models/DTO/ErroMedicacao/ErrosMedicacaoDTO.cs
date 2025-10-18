using System;
using System.Collections.Generic;

namespace VigiSaude.Backend.Models.DTO.ErroMedicacao
{
    public class ErroMedicacaoDto : IncideneteDto 
    {
        public int? IdErroMedicacao { get; set; }

    }

    public class ErroMedicacaoDetalheDto
    {
        public int? IdMedicamento { get; set; }
        public string? NomeGenerico { get; set; }
        public string? Fabricante { get; set; }
        public string? Lote { get; set; }
        public DateOnly? Validade { get; set; }
        public string? Ocorrencia { get; set; }
        public string? ResultouEfeitoNocivo { get; set; }
        public string? DescricaoEfeitoNocivo { get; set; }
        public string? CausaErro { get; set; }

        public int? IdDesfecho { get; set; }
        public string? DescricaoDesfecho { get; set; }
        public int? IdViaAdm { get; set; }
        public string? DescricaoViaAdm { get; set; }

        public string? Posologia { get; set; }
        public DateOnly? DataInicioMed { get; set; }
        public DateOnly? DataFimMed { get; set; }
        public string? Indicacao { get; set; }
    }

}

