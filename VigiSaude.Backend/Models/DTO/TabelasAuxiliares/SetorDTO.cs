namespace VigiSaude.Backend.Models.DTO.TabelasAuxiliares
{
    public class SetorDTO
    {
        public int IdSetor { get; set; }
        public required string DescricaoSetor { get; set; }

        public static explicit operator Setore(SetorDTO setor)
        {
            return new Setore()
            {
                IdSetor = setor.IdSetor,
                DescricaoSetor = setor.DescricaoSetor
            };
        }

    }
}
