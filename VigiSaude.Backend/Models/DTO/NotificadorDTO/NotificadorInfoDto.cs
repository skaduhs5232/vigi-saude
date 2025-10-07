namespace VigiSaude.Backend.Models.DTO.NotificadorDTO;

public class NotificadorInfoDto
{
    public int? IdNotificador { get; set; }
    public string? Nome { get; set; }
    public string? Email { get; set; }
    public string? Telefone { get; set; }
    public int? Setor { get; set; }
    public string? Categoria { get; set; }

    public bool FuncionarioGerenciaRisco { get; set; }

    public static explicit operator Notificadore(NotificadorInfoDto request)
    {
        return new Notificadore()
        {
            Nome = request.Nome,
            Email = request.Email,
            Telefone = request.Telefone,
            SetorIdSetor = request.Setor,
            CategoriaProfissional = request.Categoria,
            FuncionarioGerenciaRisco = request.FuncionarioGerenciaRisco
        };
    }
}
