namespace VigiSaude.Backend.Models.DTO.TabelasAuxiliares
{
    public class ViaAdmDTO
    {
        public int IdViaAdm { get; set; }
        public required string DescricaoVia { get; set; }

        public static explicit operator ViasAdm(ViaAdmDTO viaadm)
        {
            return new ViasAdm()
            {
                IdViaAdm = viaadm.IdViaAdm,
                DescricaoVia = viaadm.DescricaoVia
            };
        }

    }
}
