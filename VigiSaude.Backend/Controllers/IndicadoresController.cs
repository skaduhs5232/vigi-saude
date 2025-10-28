using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models.DTO.Indicadores;

namespace VigiSaude.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IndicadoresController(VigisaudeDbContext context) : ControllerBase
    {
        [HttpGet("EstatisticasTipoNotificacaoMensal")]
        public async Task<ActionResult<List<EstatisticaTipoNotificacaoDTO>>> GetEstatisticasTipoNotificacaoMensal()
        {
            var dataLimite = DateOnly.FromDateTime(DateTime.Today.AddMonths(-11));

            var incidentes = await context.Incidentes
                .Include(i => i.NotificadorIdNotificadorNavigation)
                .Where(i => i.DataNotificacao != null && i.DataNotificacao >= dataLimite)
                .ToListAsync();

            var agrupados = incidentes
                .GroupBy(i => new { Ano = i.DataNotificacao!.Value.Year, Mes = i.DataNotificacao.Value.Month })
                .Select(g => new EstatisticaTipoNotificacaoDTO
                {
                    Ano = g.Key.Ano,
                    Mes = g.Key.Mes,
                    BuscaAtiva = g.Count(i => i.NotificadorIdNotificadorNavigation.FuncionarioGerenciaRisco),
                    NotificacaoVoluntaria = g.Count(i => !i.NotificadorIdNotificadorNavigation.FuncionarioGerenciaRisco)
                })
                .ToList();

            var resultadoFinal = new List<EstatisticaTipoNotificacaoDTO>();
            for (int i = 0; i < 12; i++)
            {
                var data = DateTime.Today.AddMonths(-i);
                var item = agrupados.FirstOrDefault(a => a.Ano == data.Year && a.Mes == data.Month);
                resultadoFinal.Add(item ?? new EstatisticaTipoNotificacaoDTO
                {
                    Ano = data.Year,
                    Mes = data.Month,
                    BuscaAtiva = 0,
                    NotificacaoVoluntaria = 0
                });
            }

            resultadoFinal.Reverse();

            return Ok(resultadoFinal);
        }


        [HttpGet("EstatisticasTipoIncidenteMensal")]
        public async Task<ActionResult<List<EstatisticaTipoIncidenteMensalDTO>>> GetEstatisticasTipoIncidenteMensal()
        {

            var dataLimite = DateOnly.FromDateTime(DateTime.Today.AddMonths(-11));

            var incidentes = await context.Incidentes
                .Include(i => i.TipoIncidenteIdTipoIncidenteNavigation)
                .Where(i => i.DataInicio >= dataLimite)
                .ToListAsync();

            var todosTipos = await context.TiposIncidentes
                .Select(t => t.DescricaoTipoIncidente)
                .ToListAsync();

            var agrupados = incidentes
                .GroupBy(i => new { Ano = i.DataInicio.Year, Mes = i.DataInicio.Month })
                .Select(g =>
                {
                    var dict = todosTipos.ToDictionary(t => t, t => g.Count(i => i.TipoIncidenteIdTipoIncidenteNavigation.DescricaoTipoIncidente == t));
                    return new EstatisticaTipoIncidenteMensalDTO
                    {
                        Ano = g.Key.Ano,
                        Mes = g.Key.Mes,
                        QuantidadePorTipo = dict
                    };
                })
                .ToList();

            var resultadoFinal = new List<EstatisticaTipoIncidenteMensalDTO>();
            for (int i = 0; i < 12; i++)
            {
                var data = DateTime.Today.AddMonths(-i);
                var item = agrupados.FirstOrDefault(a => a.Ano == data.Year && a.Mes == data.Month);
                if (item == null)
                {
                    var dictZerado = todosTipos.ToDictionary(t => t, t => 0);
                    item = new EstatisticaTipoIncidenteMensalDTO
                    {
                        Ano = data.Year,
                        Mes = data.Month,
                        QuantidadePorTipo = dictZerado
                    };
                }
                resultadoFinal.Add(item);
            }

            resultadoFinal.Reverse();

            return Ok(resultadoFinal);
        }


        [HttpGet("EstatisticasSetorTipoIncidenteMensal")]
        public async Task<ActionResult<IEnumerable<EstatisticaSetorTipoIncidenteMensalDTO>>> GetEstatisticasSetorTipoIncidenteMensal()
        {
            var hoje = DateTime.Today;
            var inicio = hoje.AddYears(-1).AddMonths(1); 

            var incidentes = await context.Incidentes
                .Include(i => i.TipoIncidenteIdTipoIncidenteNavigation)
                .Include(i => i.SetorIdSetorNavigation)
                .Where(i => i.DataInicio.ToDateTime(TimeOnly.MinValue) >= inicio)
                .ToListAsync();

            var meses = Enumerable.Range(0, 12)
                .Select(i => inicio.AddMonths(i))
                .Select(d => d.ToString("yyyy-MM"))
                .ToList();

            var setores = await context.Setores.ToListAsync();
            var tipos = await context.TiposIncidentes.ToListAsync();

            var resultado = new List<EstatisticaSetorTipoIncidenteMensalDTO>();

            foreach (var setor in setores)
            {
                foreach (var tipo in tipos)
                {
                    foreach (var mes in meses)
                    {
                        var anoMes = DateTime.ParseExact(mes + "-01", "yyyy-MM-dd", null);
                        int quantidade = incidentes.Count(i =>
                            i.SetorIdSetor == setor.IdSetor &&
                            i.TipoIncidenteIdTipoIncidente == tipo.IdTipoIncidente &&
                            i.DataInicio.Year == anoMes.Year &&
                            i.DataInicio.Month == anoMes.Month
                        );

                        resultado.Add(new EstatisticaSetorTipoIncidenteMensalDTO
                        {
                            Setor = setor.DescricaoSetor,
                            TipoIncidente = tipo.DescricaoTipoIncidente,
                            MesAno = mes,
                            Quantidade = quantidade
                        });
                    }
                }
            }

            return Ok(resultado);
        }

        [HttpGet("EstatisticasClassificacaoIncidenteFlat")]
        public async Task<ActionResult<List<EstatisticaClassificacaoIncidenteFlatDTO>>> GetEstatisticasClassificacaoIncidenteFlat()
        {
            var hoje = DateTime.Today;
            var umAnoAtras = hoje.AddYears(-1).AddMonths(1);

            var meses = Enumerable.Range(0, 12)
                .Select(i => umAnoAtras.AddMonths(i))
                .ToList();

            var incidentes = await context.Incidentes
                .Where(i => i.DataInicio.ToDateTime(TimeOnly.MinValue) >= umAnoAtras)
                .ToListAsync();

            var classificacoes = incidentes
                .Select(i => i.ClassificacaoIncidente ?? "Não classificado")
                .Distinct()
                .ToList();

            var resultado = new List<EstatisticaClassificacaoIncidenteFlatDTO>();

            foreach (var c in classificacoes)
            {
                foreach (var m in meses)
                {
                    var count = incidentes.Count(i =>
                        (i.ClassificacaoIncidente ?? "Não classificado") == c &&
                        i.DataInicio.Year == m.Year &&
                        i.DataInicio.Month == m.Month
                    );

                    resultado.Add(new EstatisticaClassificacaoIncidenteFlatDTO
                    {
                        Classificacao = c,
                        MesAno = m.ToString("yyyy-MM"),
                        Quantidade = count
                    });
                }
            }

            return Ok(resultado);
        }


    }


}

