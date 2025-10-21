using System.Linq.Expressions;
using VigiSaude.Backend.Models.DTO.PacienteDTO;
using VigiSaude.Backend.Models.DTO.NotificadorDTO;

namespace VigiSaude.Backend.Models.DTO.Ram
{
    public class RamResponseDto
    {
        public PatienteInfoDto DadosPaciente { get; set; } = default!;
        public RamDto DadosRam { get; set; } = default!;
        public NotificadorInfoDto DadosNotificador { get; set; } = default!;
        public List<RamDetalheDto> DetalhesRam { get; set; } = new();

        public static Expression<Func<Incidente, Models.Ram, RamResponseDto>> MapeamentoGet()
        {
            return (i, ram) => new RamResponseDto
            {
                DadosPaciente = new PatienteInfoDto
                {
                    IdPaciente = i.PacienteIdPacienteNavigation.IdPaciente,
                    Nome = i.PacienteIdPacienteNavigation.Nome,
                    Protuario = i.PacienteIdPacienteNavigation.Prontuario,
                    Leito = i.PacienteIdPacienteNavigation.Leito,
                    Sexo = i.PacienteIdPacienteNavigation.Sexo,
                    Peso = i.PacienteIdPacienteNavigation.Peso,
                    DataNascimento = i.PacienteIdPacienteNavigation.DataNascimento,
                    HoraNascimento = i.PacienteIdPacienteNavigation.HoraNascimento,
                    DataAdmissao = i.PacienteIdPacienteNavigation.DataAdmissao
                },

                DadosRam = new RamDto
                {
                    IdRam = ram.IdIncidente,
                    IdPaciente = i.PacienteIdPaciente,
                    IdSetor = i.SetorIdSetor,
                    IdTipoIncidente = i.TipoIncidenteIdTipoIncidente,
                    IdNotificador = i.NotificadorIdNotificador,
                    DataInicio = i.DataInicio,
                    DataFim = i.DataFim,
                    Descricao = i.Descricao,
                    DataNotificacao = i.DataNotificacao,
                    ClassificacaoIncidente = i.ClassificacaoIncidente,
                    ClassificacaoDano = i.ClassificacaoDano
                },

                DadosNotificador = new NotificadorInfoDto
                {
                    IdNotificador = i.NotificadorIdNotificador,
                    FuncionarioGerenciaRisco = i.NotificadorIdNotificadorNavigation.FuncionarioGerenciaRisco,
                    Nome = i.NotificadorIdNotificadorNavigation.Nome,
                    Email = i.NotificadorIdNotificadorNavigation.Email,
                    Telefone = i.NotificadorIdNotificadorNavigation.Telefone,
                    Categoria = i.NotificadorIdNotificadorNavigation.CategoriaProfissional,
                    Setor = i.NotificadorIdNotificadorNavigation.SetorIdSetor
                },

                DetalhesRam = ram.RamHasMedicamentos
                    .Select(d => new RamDetalheDto
                    {
                        IdMedicamento = d.MedicamentoIdMedicamento,
                        NomeGenerico = d.MedicamentoIdMedicamentoNavigation.NomeGenerico,
                        Fabricante = d.MedicamentoIdMedicamentoNavigation.Fabricante,
                        Lote = d.MedicamentoIdMedicamentoNavigation.Lote,
                        Validade = d.MedicamentoIdMedicamentoNavigation.Validade,
                        AcaoAdotada = d.AcaoAdotada,
                        MedProvavelCausador = d.MedProvavelCausador,
                        Posologia = d.Posologia,
                        Indicacao = d.Indicacao,
                        DataInicioMed = string.IsNullOrWhiteSpace(d.DataInicioMed) ? null : DateOnly.Parse(d.DataInicioMed),
                        DataFimMed = string.IsNullOrWhiteSpace(d.DataFimMed) ? null : DateOnly.Parse(d.DataFimMed),
                        IdDesfecho = d.DesfechoIdDesfecho,
                        DescricaoDesfecho = d.DesfechoIdDesfechoNavigation.DescricaoDesfecho,
                        IdViaAdm = d.ViaAdmIdViaAdm,
                        DescricaoViaAdm = d.ViaAdmIdViaAdmNavigation.DescricaoVia
                    }).ToList()
            };
        }
    }
}

