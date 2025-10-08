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
        
        // Sempre carrega setores (usado em todos os formulários)
        const setoresPromise = obterSetores();
        
        // Carrega dados específicos baseado na modalidade
        const promises: Promise<unknown>[] = [setoresPromise];
        
        if (modalidade === 'queda') {
          promises.push(
            obterTiposQueda(),
            obterLocaisQueda(),
            obterFatoresRiscoQueda(),
            obterCategoriasMedicamentoQueda()
          );
        } else if (modalidade === 'lesao-pressao') {
          promises.push(obterLocaisLesao());
        }
        
        const resultados = await Promise.all(promises);
        
        const setoresData = resultados[0] as Setor[];
        const tiposQuedaData = modalidade === 'queda' ? (resultados[1] as TipoQueda[]) : [];
        const locaisQuedaData = modalidade === 'queda' ? (resultados[2] as LocalQueda[]) : [];
        const fatoresRiscoQuedaData = modalidade === 'queda' ? (resultados[3] as FatorRiscoQueda[]) : [];
        const categoriasMedicamentoQuedaData = modalidade === 'queda' ? (resultados[4] as CategoriaMedicamentoQueda[]) : [];
        const locaisLesaoData = modalidade === 'lesao-pressao' ? (resultados[1] as LocalLesao[]) : [];
        
        setDados({
          setores: setoresData || [],
          tiposQueda: tiposQuedaData || [],
          locaisQueda: locaisQuedaData || [],
          fatoresRiscoQueda: fatoresRiscoQuedaData || [],
          categoriasMedicamentoQueda: categoriasMedicamentoQuedaData || [],
          locaisLesao: locaisLesaoData || [],
          tiposIncidente: [],
          carregando: false
        });
        
        console.log('Dados dinâmicos carregados:', {
          setores: setoresData?.length || 0,
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
