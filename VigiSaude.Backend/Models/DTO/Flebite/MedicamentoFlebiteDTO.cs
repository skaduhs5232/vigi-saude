namespace VigiSaude.Backend.Models.DTO.Flebite
{
    public class MedicamentoFlebiteDTO
    {
        public int IdMedicamento { get; set; }
        public string? NomeGenerico { get; set; }
        public string? Fabricante { get; set; }
        public string? Lote { get; set; }
        public DateOnly? Validade { get; set; }

        public string? Diluente { get; set; }
        public string? ModoInfusao { get; set; }
    }
}
