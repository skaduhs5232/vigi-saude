namespace VigiSaude.Backend.Models.DTO.Indicadores
{
    public class EstatisticaClassificacaoIncidenteFlatDTO
    {
        public string Classificacao { get; set; } = string.Empty; 
        public string MesAno { get; set; } = string.Empty;       
        public int Quantidade { get; set; }
    }
}

