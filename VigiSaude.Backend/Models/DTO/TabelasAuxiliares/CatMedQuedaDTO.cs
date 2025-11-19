namespace VigiSaude.Backend.Models.DTO.TabelasAuxiliares
{
    public class CatMedQuedaDTO
    {
        public int IdCategoriaMedicamentoQueda { get; set; }
        public required string DescricaoCatMedQueda { get; set; }

        public static explicit operator CategoriasMedicamentoQuedum(CatMedQuedaDTO catmedqueda)
        {
            return new CategoriasMedicamentoQuedum()
            {
                IdCategoriaMedicamentoQueda = catmedqueda.IdCategoriaMedicamentoQueda,
                DescricaoCatMedQueda = catmedqueda.DescricaoCatMedQueda
            };
        }

    }
}
