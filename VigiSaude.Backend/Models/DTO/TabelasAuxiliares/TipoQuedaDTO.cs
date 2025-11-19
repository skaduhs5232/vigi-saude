namespace VigiSaude.Backend.Models.DTO.TabelasAuxiliares
{
    public class TipoQuedaDTO
    {
        public int IdTipoQueda { get; set; }
        public required string DescricaoTipo { get; set; }

        public static explicit operator TiposQuedum(TipoQuedaDTO tipoqueda)
        {
            return new TiposQuedum()
            {
                IdTipoQueda = tipoqueda.IdTipoQueda,
                DescricaoTipo = tipoqueda.DescricaoTipo
            };
        }
    }
}
