using System;
using VigiSaude.Backend.Models.DTO.PacienteDTO;
using VigiSaude.Backend.Models.DTO.NotificadorDTO;

namespace VigiSaude.Backend.Models.DTO.Queda
{
    public class QuedaRequestDto
    {
        public required PatienteInfoDto DadosPaciente { get; set; }
        public required QuedaDto DadosQueda { get; set; }
        public required NotificadorInfoDto DadosNotificador { get; set; }

        public static explicit operator Models.Queda(QuedaRequestDto request)
        {
            return new Models.Queda
            {
                // IdIncidente = request.DadosQueda.IdQueda ?? 0,
                IdIncidenteNavigation = new Incidente
                {
                    PacienteIdPaciente = request.DadosPaciente.IdPaciente!.Value,
                    SetorIdSetor = request.DadosQueda.IdSetor,
                    TipoIncidenteIdTipoIncidente = request.DadosQueda.IdTipoIncidente,
                    NotificadorIdNotificador = request.DadosQueda.IdNotificador,
                    DataInicio = request.DadosQueda.DataInicio,
                    DataFim = request.DadosQueda.DataFim,
                    Descricao = request.DadosQueda.Descricao ?? string.Empty,
                    DataNotificacao = request.DadosQueda.DataNotificacao,
                    ClassificacaoIncidente = request.DadosQueda.ClassificacaoIncidente,
                    ClassificacaoDano = request.DadosQueda.ClassificacaoDano,
                },
                Diagnostico = request.DadosQueda.Diagnostico,
                AvaliacaoRiscoAdmissao = request.DadosQueda.AvaliacaoRiscoAdmissao,
                RegistroOrientacaoProntuario = request.DadosQueda.RegistroOrientacaoProntuario,
                RiscoIdentificadoAdmissao = request.DadosQueda.RiscoIdentificadoAdmissao,
                PacienteComAcompanhante = request.DadosQueda.PacienteComAcompanhante,
                QtdMedBaixoRisco = request.DadosQueda.QtdMedBaixoRisco,
                QtdMedMedioRisco = request.DadosQueda.QtdMedMedioRisco,
                QtdMedAltoRisco = request.DadosQueda.QtdMedAltoRisco,
                TipoQuedaIdTipoQueda = request.DadosQueda.TipoQuedaId,
                LocalQuedaIdLocalQueda = request.DadosQueda.LocalQuedaId,
                Horario = request.DadosQueda.Horario,
                Turno = request.DadosQueda.Turno,
                Desfecho = request.DadosQueda.Desfecho
            };
        }
    }
}
