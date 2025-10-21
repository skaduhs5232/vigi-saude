using System.Linq.Expressions;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Models.DTO.NotificadorDTO;
using VigiSaude.Backend.Models.DTO.PacienteDTO;
using VigiSaude.Backend.Models.DTO.Queda;

namespace VigiSaude.Backend.Models.DTO.Queda
{
    public class QuedaResponseDto
    {
        public PatienteInfoDto DadosPaciente { get; set; } = default!;
        public QuedaDto DadosQueda { get; set; } = default!;
        public NotificadorInfoDto DadosNotificador { get; set; } = default!;
        public List<CategoriaMedicamentoQuedaDto> CategoriasMedicamento { get; set; } = new();
        public List<FatorRiscoQuedaDto> FatoresRisco { get; set; } = new();

        public static Expression<Func<Incidente, Models.Queda, QuedaResponseDto>> MapeamentoGet()
        {
            return (i, q) => new QuedaResponseDto
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

                DadosQueda = new QuedaDto
                {
                    IdQueda = q.IdIncidente,
                    IdPaciente = i.PacienteIdPaciente,
                    IdSetor = i.SetorIdSetor,
                    IdTipoIncidente = i.TipoIncidenteIdTipoIncidente,
                    IdNotificador = i.NotificadorIdNotificador,
                    DataInicio = i.DataInicio,
                    DataFim = i.DataFim,
                    DataNotificacao = i.DataNotificacao,
                    Descricao = i.Descricao,
                    ClassificacaoIncidente = i.ClassificacaoIncidente,
                    ClassificacaoDano = i.ClassificacaoDano,

                    Diagnostico = q.Diagnostico,
                    AvaliacaoRiscoAdmissao = q.AvaliacaoRiscoAdmissao,
                    RegistroOrientacaoProntuario = q.RegistroOrientacaoProntuario,
                    RiscoIdentificadoAdmissao = q.RiscoIdentificadoAdmissao,
                    PacienteComAcompanhante = q.PacienteComAcompanhante,
                    QtdMedBaixoRisco = q.QtdMedBaixoRisco,
                    QtdMedMedioRisco = q.QtdMedMedioRisco,
                    QtdMedAltoRisco = q.QtdMedAltoRisco,
                    TipoQuedaId = q.TipoQuedaIdTipoQueda,
                    LocalQuedaId = q.LocalQuedaIdLocalQueda,
                    Horario = q.Horario,
                    Turno = q.Turno,
                    Desfecho = q.Desfecho
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

                CategoriasMedicamento = q.CategoriasMedicamentoQuedaHasQueda.Select(cm => new CategoriaMedicamentoQuedaDto
                {
                    IdCategoriaMedicamentoQueda = cm.CategoriaMedicamentoQuedaIdCategoriaMedicamentoQueda,
                    DescricaoCategoria = cm.CategoriaMedicamentoQuedaIdCategoriaMedicamentoQuedaNavigation.DescricaoCatMedQueda,
                    DescricaoMeds = cm.DescricaoMeds
                }).ToList(),

                FatoresRisco = q.FatorRiscoQuedaIdFatorRiscoQueda.Select(fr => new FatorRiscoQuedaDto
                {
                    IdFatorRiscoQueda = fr.IdFatorRiscoQueda,
                    DescricaoFator = fr.DescricaoFator
                }).ToList()
            };
        }
    }
}

