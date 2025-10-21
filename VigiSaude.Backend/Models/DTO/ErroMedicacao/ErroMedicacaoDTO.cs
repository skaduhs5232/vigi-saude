namespace VigiSaude.Backend.Models.DTO.ErroMedicacao
{
    public class ErroMedicacaoDto : IncideneteDto
    {
        public List<MedicamentoErroMedicacaoDto>? Medicamentos { get; set; }
    }

    public class MedicamentoErroMedicacaoDto
    {
        public int? IdMedicamento { get; set; }
        public string? NomeGenerico { get; set; }
        public string? Fabricante { get; set; }
        public string? Lote { get; set; }
        public DateTime? Validade { get; set; }

        public string? Ocorrencia { get; set; }
        public string? ResultouEfeitoNocivo { get; set; }
        public string? DescricaoEfeitoNocivo { get; set; }
        public string? CausaErro { get; set; }
        public int? DesfechoIdDesfecho { get; set; }
        public int? ViaAdmIdViaAdm { get; set; }
        public string? Posologia { get; set; }
        public DateTime? DataInicioMed { get; set; }
        public DateTime? DataFimMed { get; set; }
        public string? Indicacao { get; set; }
    }
}
