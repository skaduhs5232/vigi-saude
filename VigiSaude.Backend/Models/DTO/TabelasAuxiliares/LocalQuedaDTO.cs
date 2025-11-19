namespace VigiSaude.Backend.Models.DTO.TabelasAuxiliares
{
    public class LocalQuedaDTO
    {
        public int IdLocalQueda { get; set; }
        public required string DescricaoLocal { get; set; }

        public static explicit operator LocaisQuedum(LocalQuedaDTO localqueda)
        {
            return new LocaisQuedum()
            {
                IdLocalQueda = localqueda.IdLocalQueda,
                DescricaoLocal = localqueda.DescricaoLocal
            };
        }

    }
}
