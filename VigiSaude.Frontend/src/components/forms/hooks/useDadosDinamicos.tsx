import { useState, useEffect } from 'react';
import {
  TipoQueda,
  TipoIncidente,
  Setor,
  LocalQueda,
  LocalLesao,
  FatorRiscoQueda,
  CategoriaMedicamentoQueda,
  obterTiposQueda,
  obterTiposIncidente,
  obterSetores,
  obterLocaisQueda,
  obterLocaisLesao,
  obterFatoresRiscoQueda,
  obterCategoriasMedicamentoQueda
} from '../services/comum.service';

export interface DadosDinamicos {
  tiposQueda: TipoQueda[];
  tiposIncidente: TipoIncidente[];
  setores: Setor[];
  locaisQueda: LocalQueda[];
  locaisLesao: LocalLesao[];
  fatoresRiscoQueda: FatorRiscoQueda[];
  categoriasMedicamentoQueda: CategoriaMedicamentoQueda[];
  carregando: boolean;
}

export const useDadosDinamicos = (modalidade?: string) => {
  const [dados, setDados] = useState<DadosDinamicos>({
    tiposQueda: [],
    tiposIncidente: [],
    setores: [],
    locaisQueda: [],
    locaisLesao: [],
    fatoresRiscoQueda: [],
    categoriasMedicamentoQueda: [],
    carregando: true
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        console.log('Carregando dados dinâmicos...');

        const setoresPromise = obterSetores();
        const tiposIncidentePromise = obterTiposIncidente();

        const extrasPromises: Promise<unknown>[] = [];

        if (modalidade === 'queda') {
          extrasPromises.push(
            obterTiposQueda(),
            obterLocaisQueda(),
            obterFatoresRiscoQueda(),
            obterCategoriasMedicamentoQueda()
          );
        } else if (modalidade === 'lesao-pressao') {
          extrasPromises.push(obterLocaisLesao());
        }

        const resultados = await Promise.all([
          setoresPromise,
          tiposIncidentePromise,
          ...extrasPromises
        ]);

        const setoresData = resultados[0] as Setor[];
        const tiposIncidenteData = resultados[1] as TipoIncidente[];
        const restantes = resultados.slice(2);

        let tiposQuedaData: TipoQueda[] = [];
        let locaisQuedaData: LocalQueda[] = [];
        let fatoresRiscoQuedaData: FatorRiscoQueda[] = [];
        let categoriasMedicamentoQuedaData: CategoriaMedicamentoQueda[] = [];
        let locaisLesaoData: LocalLesao[] = [];

        if (modalidade === 'queda') {
          tiposQuedaData = (restantes[0] as TipoQueda[]) || [];
          locaisQuedaData = (restantes[1] as LocalQueda[]) || [];
          fatoresRiscoQuedaData = (restantes[2] as FatorRiscoQueda[]) || [];
          categoriasMedicamentoQuedaData = (restantes[3] as CategoriaMedicamentoQueda[]) || [];
        } else if (modalidade === 'lesao-pressao') {
          locaisLesaoData = (restantes[0] as LocalLesao[]) || [];
        }

        setDados({
          setores: setoresData || [],
          tiposIncidente: tiposIncidenteData || [],
          tiposQueda: tiposQuedaData,
          locaisQueda: locaisQuedaData,
          fatoresRiscoQueda: fatoresRiscoQuedaData,
          categoriasMedicamentoQueda: categoriasMedicamentoQuedaData,
          locaisLesao: locaisLesaoData,
          carregando: false
        });

        console.log('Dados dinâmicos carregados:', {
          setores: setoresData?.length || 0,
          tiposIncidente: tiposIncidenteData?.length || 0,
          ...(modalidade === 'queda' && {
            tiposQueda: tiposQuedaData?.length || 0,
            locaisQueda: locaisQuedaData?.length || 0,
            fatoresRiscoQueda: fatoresRiscoQuedaData?.length || 0,
            categoriasMedicamentoQueda: categoriasMedicamentoQuedaData?.length || 0
          }),
          ...(modalidade === 'lesao-pressao' && {
            locaisLesao: locaisLesaoData?.length || 0
          })
        });
      } catch (error) {
        console.error('Erro ao carregar dados dinâmicos:', error);
        setDados(prev => ({ ...prev, carregando: false }));
      }
    };

    carregarDados();
  }, [modalidade]);

  return dados;
};
