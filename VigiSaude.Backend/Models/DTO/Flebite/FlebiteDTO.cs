namespace VigiSaude.Backend.Models.DTO.Flebite
{
    public class FlebiteDto : IncideneteDto
    {
        public int? IdFlebite { get; set; }
        public string? Diagnostico { get; set; }
        public string? GrauFlebite { get; set; }
        public string? LocalPuncao { get; set; }
        public int? QtdPuncoesAteIncidente { get; set; }
        public string? TipoCateter { get; set; }
        public string? CalibreCateter { get; set; }
        public int? NumCateteresInseridos { get; set; }
        public decimal? TempoPermanenciaAcesso { get; set; }
        public int? QtdMedVesicanteIrritante { get; set; }
        public List<MedicamentoFlebiteDTO>? Medicamentos { get; set; }
    }
}
