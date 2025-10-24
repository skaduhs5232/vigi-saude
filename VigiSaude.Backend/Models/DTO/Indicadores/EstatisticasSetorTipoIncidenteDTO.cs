namespace VigiSaude.Backend.Models.DTO.Indicadores
{
    public class EstatisticaSetorTipoIncidenteMensalDTO
    {
        public string Setor { get; set; } = string.Empty;
        public string TipoIncidente { get; set; } = string.Empty;
        public string MesAno { get; set; } = string.Empty; 
        public int Quantidade { get; set; }
    }
}

