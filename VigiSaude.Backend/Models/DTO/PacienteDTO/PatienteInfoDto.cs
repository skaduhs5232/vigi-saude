namespace VigiSaude.Backend.Models.DTO.PacienteDTO;

public class PatienteInfoDto
{
    public int? IdPaciente { get; set; }
    public required string Nome { get; set; }
    public required string Protuario { get; set; }
    public string? Leito { get; set; }
    public string? Sexo { get; set; }
    public decimal? Peso { get; set; }
    public required DateOnly DataNascimento { get; set; }
    public TimeOnly? HoraNascimento { get; set; }
    public DateOnly? DataAdmissao { get; set; }

    public static explicit operator Paciente(PatienteInfoDto pacienteInfoDto)
    {
        return new Paciente
        {
            Nome = pacienteInfoDto.Nome,
            Prontuario = pacienteInfoDto.Protuario,
            Leito = pacienteInfoDto.Leito,
            Sexo = pacienteInfoDto.Sexo,
            Peso = pacienteInfoDto.Peso,
            DataNascimento = pacienteInfoDto.DataNascimento,
            HoraNascimento = pacienteInfoDto.HoraNascimento,
            DataAdmissao = pacienteInfoDto.DataAdmissao
        };
    }
}
