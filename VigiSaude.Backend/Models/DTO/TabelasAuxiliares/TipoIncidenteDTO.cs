namespace VigiSaude.Backend.Models.DTO.TabelasAuxiliares
{
    public class TipoIncidenteDTO
    {

        public int IdTipoIncidente { get; set; }
        public required string DescricaoTipoIncidente { get; set; }

        public static explicit operator TiposIncidente(TipoIncidenteDTO tipoincidente)
        {
            return new TiposIncidente()
            {
                IdTipoIncidente = tipoincidente.IdTipoIncidente,
                DescricaoTipoIncidente = tipoincidente.DescricaoTipoIncidente
            };
        }

    }
}
