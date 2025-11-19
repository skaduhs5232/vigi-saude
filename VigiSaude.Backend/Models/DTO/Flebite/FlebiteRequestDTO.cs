using VigiSaude.Backend.Models.DTO.NotificadorDTO;
using VigiSaude.Backend.Models.DTO.PacienteDTO;

namespace VigiSaude.Backend.Models.DTO.Flebite
{
    public class FlebiteRequestDTO
    {
        public required PatienteInfoDto DadosPaciente { get; set; }
        public required FlebiteDto DadosFlebite { get; set; }
        public required NotificadorInfoDto DadosNotificador { get; set; }
        public List<MedicamentoFlebiteDTO>? Medicamentos { get; set; }

        public static explicit operator VigiSaude.Backend.Models.Flebite(FlebiteRequestDTO request)
        {
            var incidente = new Incidente
            {
                PacienteIdPaciente = (int)request.DadosPaciente.IdPaciente!,
                SetorIdSetor = request.DadosFlebite.IdSetor,
                TipoIncidenteIdTipoIncidente = request.DadosFlebite.IdTipoIncidente,
                NotificadorIdNotificador = request.DadosFlebite.IdNotificador,
                DataInicio = request.DadosFlebite.DataInicio,
                DataFim = request.DadosFlebite.DataFim,
                Descricao = request.DadosFlebite.Descricao,
                DataNotificacao = request.DadosFlebite.DataNotificacao,
                ClassificacaoIncidente = request.DadosFlebite.ClassificacaoIncidente,
                ClassificacaoDano = request.DadosFlebite.ClassificacaoDano
            };

            var flebite = new VigiSaude.Backend.Models.Flebite
            {
                IdIncidenteNavigation = incidente,
                Diagnóstico = request.DadosFlebite.Diagnostico,
                GrauFlebite = request.DadosFlebite.GrauFlebite,
                LocalPuncao = request.DadosFlebite.LocalPuncao,
                QtdPuncoesAteIncidente = request.DadosFlebite.QtdPuncoesAteIncidente,
                TipoCateter = request.DadosFlebite.TipoCateter,
                CalibreCateter = request.DadosFlebite.CalibreCateter,
                NumCateteresInseridos = request.DadosFlebite.NumCateteresInseridos,
                TempoPermanenciaAcesso = request.DadosFlebite.TempoPermanenciaAcesso,
                QtdMedVesicanteIrritante = request.DadosFlebite.QtdMedVesicanteIrritante,
            };

            if (request.Medicamentos != null && request.Medicamentos.Any())
            {
                flebite.FlebitesHasMedicamentos = request.Medicamentos.Select(m => new FlebitesHasMedicamento
                {
                    MedicamentoIdMedicamento = m.IdMedicamento,
                    Diluente = m.Diluente,
                    ModoInfusao = m.ModoInfusao
                }).ToList();
            }

            return flebite;
        }
    }
}
