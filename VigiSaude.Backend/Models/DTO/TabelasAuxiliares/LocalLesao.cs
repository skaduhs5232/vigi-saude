namespace VigiSaude.Backend.Models.DTO.TabelasAuxiliares
{
    public class LocalLesaoDTO
    {
        public int IdLocalLesao { get; set; }
        public required string DescricaoLocal { get; set; }

        public static explicit operator LocaisLesao(LocalLesaoDTO locallesao)
        {
            return new LocaisLesao()
            {
                IdLocalLesao = locallesao.IdLocalLesao,
                DescricaoLocal = locallesao.DescricaoLocal
            };
        }

    }
}
