namespace VigiSaude.Backend.Models.DTO.TabelasAuxiliares
{
    public class FatoresRiscoQuedaDTO
    {
        public int IdFatorRiscoQueda { get; set; }
        public required string DescricaoFator { get; set; }

        public static explicit operator FatoresRiscoQuedum(FatoresRiscoQuedaDTO fatorqueda)
        {
            return new FatoresRiscoQuedum()
            {
                IdFatorRiscoQueda = fatorqueda.IdFatorRiscoQueda,
                DescricaoFator = fatorqueda.DescricaoFator
            };
        }
    }
}
