using System.Linq.Expressions;
using VigiSaude.Backend.Models.DTO.PacienteDTO;
using VigiSaude.Backend.Models.DTO.NotificadorDTO;

namespace VigiSaude.Backend.Models.DTO.ErroMedicacao
{
    public class ErroMedicacaoResponseDto
    {
        public PatienteInfoDto DadosPaciente { get; set; } = default!;
        public ErroMedicacaoDto DadosErroMedicacao { get; set; } = default!;
        public NotificadorInfoDto DadosNotificador { get; set; } = default!;
        public List<ErroMedicacaoDetalheDto> DetalhesErros { get; set; } = new();

        public static Expression<Func<Incidente, ErrosMedicacao, ErroMedicacaoResponseDto>> MapeamentoGet()
        {
            return (i, em) => new ErroMedicacaoResponseDto
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

                DadosErroMedicacao = new ErroMedicacaoDto
                {
                    IdErroMedicacao = em.IdIncidente,
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

                DetalhesErros = em.ErrosMedicacaoHasMedicamentos
                    .Select(d => new ErroMedicacaoDetalheDto
                    {
                        IdMedicamento = d.MedicamentoIdMedicamento,
                        NomeGenerico = d.MedicamentoIdMedicamentoNavigation.NomeGenerico,
                        Fabricante = d.MedicamentoIdMedicamentoNavigation.Fabricante,
                        Lote = d.MedicamentoIdMedicamentoNavigation.Lote,
                        Validade = d.MedicamentoIdMedicamentoNavigation.Validade,
                        Ocorrencia = d.Ocorrencia,
                        ResultouEfeitoNocivo = d.ResultouEfeitoNocivo,
                        DescricaoEfeitoNocivo = d.DescricaoEfeitoNocivo,
                        CausaErro = d.CausaErro,
                        IdDesfecho = d.DesfechoIdDesfecho,
                        DescricaoDesfecho = d.DesfechoIdDesfechoNavigation.DescricaoDesfecho,
                        IdViaAdm = d.ViaAdmIdViaAdm,
                        DescricaoViaAdm = d.ViaAdmIdViaAdmNavigation.DescricaoVia,
                        Posologia = d.Posologia,
                        DataInicioMed = d.DataInicioMed,
                        DataFimMed = d.DataFimMed,
                        Indicacao = d.Indicacao
                    }).ToList()
            };
        }
    }
}

