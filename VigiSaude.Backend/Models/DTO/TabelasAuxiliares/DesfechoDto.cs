namespace VigiSaude.Backend.Models.DTO.TabelasAuxiliares;

public class DesfechoDto
{
    public int IdDesfecho { get; set; }
    public required string DescricaoDesfecho { get; set; }

    public static explicit operator Desfecho(DesfechoDto desfecho)
    {
        return new Desfecho()
        {
            IdDesfecho = desfecho.IdDesfecho,
            DescricaoDesfecho = desfecho.DescricaoDesfecho
        };
    }
}
