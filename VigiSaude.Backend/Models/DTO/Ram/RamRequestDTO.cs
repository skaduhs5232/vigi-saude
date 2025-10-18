using VigiSaude.Backend.Models.DTO.NotificadorDTO;
using VigiSaude.Backend.Models.DTO.PacienteDTO;
using VigiSaude.Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace VigiSaude.Backend.Models.DTO.Ram
{
    public class RamRequestDto
    {
        public required PatienteInfoDto DadosPaciente { get; set; }
        public required NotificadorInfoDto DadosNotificador { get; set; }
        public required RamDto DadosRam { get; set; }
        public List<RamDetalheDto> DetalhesRam { get; set; } = new();

        public static explicit operator Models.Ram(RamRequestDto request)
        {
            return new Models.Ram
            {
                IdIncidenteNavigation = new Incidente
                {
                    PacienteIdPaciente = request.DadosPaciente.IdPaciente!.Value,
                    SetorIdSetor = request.DadosRam.IdSetor,
                    TipoIncidenteIdTipoIncidente = request.DadosRam.IdTipoIncidente,
                    NotificadorIdNotificador = request.DadosRam.IdNotificador,
                    DataInicio = request.DadosRam.DataInicio,
                    DataFim = request.DadosRam.DataFim,
                    Descricao = request.DadosRam.Descricao ?? string.Empty,
                    DataNotificacao = request.DadosRam.DataNotificacao,
                    ClassificacaoIncidente = request.DadosRam.ClassificacaoIncidente,
                    ClassificacaoDano = request.DadosRam.ClassificacaoDano
                },
                RamHasMedicamentos = request.DetalhesRam.Select(d => new RamHasMedicamento
                {
                    MedicamentoIdMedicamento = d.IdMedicamento!.Value,
                    AcaoAdotada = d.AcaoAdotada,
                    MedProvavelCausador = d.MedProvavelCausador,
                    Posologia = d.Posologia,
                    Indicacao = d.Indicacao,
                    DataInicioMed = d.DataInicioMed?.ToString("yyyy-MM-dd"),
                    DataFimMed = d.DataFimMed?.ToString("yyyy-MM-dd"),
                    ViaAdmIdViaAdm = d.IdViaAdm,
                    DesfechoIdDesfecho = d.IdDesfecho
                }).ToList()
            };
        }
    }
}

