using VigiSaude.Backend.Models.DTO.NotificadorDTO;
using VigiSaude.Backend.Models.DTO.PacienteDTO;
using VigiSaude.Backend.Models;
using System;
using System.Collections.Generic;
using VigiSaude.Backend.Models.DTO.ErroMedicacao;

namespace VigiSaude.Backend.Models.DTO.ErroMedicacao
{
    public class ErroMedicacaoRequestDto
    {
        public required PatienteInfoDto DadosPaciente { get; set; }
        public required NotificadorInfoDto DadosNotificador { get; set; }
        public required ErroMedicacaoDto DadosErroMedicacao { get; set; }
        public List<ErroMedicacaoDetalheDto> DetalhesErros { get; set; } = new();

        public static explicit operator Models.ErrosMedicacao(ErroMedicacaoRequestDto request)
        {
            return new Models.ErrosMedicacao
            {
                IdIncidenteNavigation = new Incidente
                {
                    PacienteIdPaciente = request.DadosPaciente.IdPaciente!.Value,
                    SetorIdSetor = request.DadosErroMedicacao.IdSetor, 
                    TipoIncidenteIdTipoIncidente = request.DadosErroMedicacao.IdTipoIncidente, 
                    NotificadorIdNotificador = request.DadosErroMedicacao.IdNotificador, 
                    DataInicio = request.DadosErroMedicacao.DataInicio, 
                    DataFim = request.DadosErroMedicacao.DataFim,
                    Descricao = request.DadosErroMedicacao.Descricao ?? string.Empty,
                    DataNotificacao = request.DadosErroMedicacao.DataNotificacao,
                    ClassificacaoIncidente = request.DadosErroMedicacao.ClassificacaoIncidente,
                    ClassificacaoDano = request.DadosErroMedicacao.ClassificacaoDano
                },
                ErrosMedicacaoHasMedicamentos = request.DetalhesErros.Select(d => new ErrosMedicacaoHasMedicamento
                {
                    MedicamentoIdMedicamento = d.IdMedicamento!.Value,
                    Ocorrencia = d.Ocorrencia,
                    ResultouEfeitoNocivo = d.ResultouEfeitoNocivo,
                    DescricaoEfeitoNocivo = d.DescricaoEfeitoNocivo,
                    CausaErro = d.CausaErro,
                    DesfechoIdDesfecho = d.IdDesfecho,
                    ViaAdmIdViaAdm = d.IdViaAdm,
                    Posologia = d.Posologia,
                    DataInicioMed = d.DataInicioMed,
                    DataFimMed = d.DataFimMed,
                    Indicacao = d.Indicacao
                }).ToList()
            };
        }
    }
}

