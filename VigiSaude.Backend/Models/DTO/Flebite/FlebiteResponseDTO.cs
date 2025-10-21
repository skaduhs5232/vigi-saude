using System.Linq.Expressions;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.Flebite;
using VigiSaude.Backend.Models.DTO.NotificadorDTO;
using VigiSaude.Backend.Models.DTO.PacienteDTO;

namespace VigiSaude.Backend.Models.DTO.Flebite
{
    public class FlebiteResponseDto
    {
        public PatienteInfoDto DadosPaciente { get; set; } = default!;
        public FlebiteDto DadosFlebite { get; set; } = default!;
        public NotificadorInfoDto DadosNotificador { get; set; } = default!;
        public List<MedicamentoFlebiteDTO> Medicamentos { get; set; } = new();

        public static Expression<Func<Incidente, Models.Flebite, FlebiteResponseDto>> MapeamentoGet()
        {
            return (i, f) => new FlebiteResponseDto
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

                DadosFlebite = new FlebiteDto
                {
                    IdFlebite = f.IdIncidente,
                    IdPaciente = i.PacienteIdPaciente,
                    IdSetor = i.SetorIdSetor,
                    IdTipoIncidente = i.TipoIncidenteIdTipoIncidente,
                    IdNotificador = i.NotificadorIdNotificador,
                    DataInicio = i.DataInicio,
                    DataFim = i.DataFim,
                    Descricao = i.Descricao,
                    DataNotificacao = i.DataNotificacao,
                    ClassificacaoIncidente = i.ClassificacaoIncidente,
                    ClassificacaoDano = i.ClassificacaoDano,

                    Diagnostico = f.Diagnóstico,
                    GrauFlebite = f.GrauFlebite,
                    LocalPuncao = f.LocalPuncao,
                    QtdPuncoesAteIncidente = f.QtdPuncoesAteIncidente,
                    TipoCateter = f.TipoCateter,
                    CalibreCateter = f.CalibreCateter,
                    NumCateteresInseridos = f.NumCateteresInseridos,
                    TempoPermanenciaAcesso = f.TempoPermanenciaAcesso,
                    QtdMedVesicanteIrritante = f.QtdMedVesicanteIrritante
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

                Medicamentos = f.FlebitesHasMedicamentos.Select(fm => new MedicamentoFlebiteDTO
                {
                    IdMedicamento = fm.MedicamentoIdMedicamento,
                    NomeGenerico = fm.MedicamentoIdMedicamentoNavigation.NomeGenerico,
                    Fabricante = fm.MedicamentoIdMedicamentoNavigation.Fabricante,
                    Lote = fm.MedicamentoIdMedicamentoNavigation.Lote,
                    Validade = fm.MedicamentoIdMedicamentoNavigation.Validade,
                    Diluente = fm.Diluente,
                    ModoInfusao = fm.ModoInfusao
                }).ToList()
            };
        }
    }
}

