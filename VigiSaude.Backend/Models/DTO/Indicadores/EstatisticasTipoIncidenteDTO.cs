namespace VigiSaude.Backend.Models.DTO.Indicadores
{
    public class EstatisticaTipoIncidenteMensalDTO
    {
        public int Ano { get; set; }
        public int Mes { get; set; }
        public Dictionary<string, int> QuantidadePorTipo { get; set; } = new Dictionary<string, int>();
    }
}
