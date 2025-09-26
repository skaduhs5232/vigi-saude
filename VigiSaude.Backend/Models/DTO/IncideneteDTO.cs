namespace VigiSaude.Backend.Models.DTO;

public class IncideneteDTO
{
    public int? IdPaciente { get; set; }
    public required int IdSetor { get; set; }
    public required int IdTipoIncidente { get; set; }
    public required int IdNotificador { get; set; }
    public required DateOnly DataInicio { get; set; }
    public DateOnly? DataFim { get; set; }
    public required string Descricao { get; set; }
    public DateOnly? DataNotificacao { get; set; }
    public string? ClassificacaoIncidente { get; set; }
    public string? ClassificacaoDano { get; set; }
}
