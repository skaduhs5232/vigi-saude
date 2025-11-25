import axios from 'axios';

const API_BASE_URL = 'https://vigisaude.cleitonween.com.br';

export interface TipoQueda {
  idTipoQueda: number;
  descricaoTipo: string;
}

export interface TipoIncidente {
  idTipoIncidente: number;
  descricaoTipoIncidente: string;
}

export interface Setor {
  idSetor: number;
  descricaoSetor: string;
}

export interface LocalQueda {
  idLocalQueda: number;
  descricaoLocal: string;
}

export interface LocalLesao {
  idLocalLesao: number;
  descricaoLocal: string;
}

export interface FatorRiscoQueda {
  idFatorRiscoQueda: number;
  descricaoFator: string;
}

export interface CategoriaMedicamentoQueda {
  idCategoriaMedicamentoQueda: number;
  descricaoCatMedQueda: string;
}

export const obterTiposQueda = async (): Promise<TipoQueda[]> => {
  try {
    const response = await axios.get<TipoQueda[]>(`${API_BASE_URL}/api/TipoQueda/GetTodosTiposQueda`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter tipos de queda:', error);
    return [];
  }
};

export const obterTiposIncidente = async (): Promise<TipoIncidente[]> => {
  try {
    const response = await axios.get<TipoIncidente[]>(`${API_BASE_URL}/api/TipoIncidente/GetTodosTiposIncidentes`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter tipos de incidente:', error);
    return [];
  }
};

export const obterSetores = async (): Promise<Setor[]> => {
  try {
    const response = await axios.get<Setor[]>(`${API_BASE_URL}/api/Setor/GetTodosSetores`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter setores:', error);
    return [];
  }
};

export const obterLocaisQueda = async (): Promise<LocalQueda[]> => {
  try {
    const response = await axios.get<LocalQueda[]>(`${API_BASE_URL}/api/LocalQueda/GetTodosLocaisQueda`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter locais de queda:', error);
    return [];
  }
};

export const obterLocaisLesao = async (): Promise<LocalLesao[]> => {
  try {
    const response = await axios.get<LocalLesao[]>(`${API_BASE_URL}/api/LocalLesao/GetTodosLocaisLesao`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter locais de lesão:', error);
    return [];
  }
};

export const obterFatoresRiscoQueda = async (): Promise<FatorRiscoQueda[]> => {
  try {
    const response = await axios.get<FatorRiscoQueda[]>(`${API_BASE_URL}/api/FatorRiscoQueda/GetTodosFatoresRiscoQueda`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter fatores de risco de queda:', error);
    return [];
  }
};

export const obterCategoriasMedicamentoQueda = async (): Promise<CategoriaMedicamentoQueda[]> => {
  try {
    const response = await axios.get<CategoriaMedicamentoQueda[]>(`${API_BASE_URL}/api/CatMedQueda/GetTodosCatMedQueda`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter categorias de medicamento queda:', error);
    return [];
  }
};

export default {
  obterTiposQueda,
  obterTiposIncidente,
  obterSetores,
  obterLocaisQueda,
  obterLocaisLesao,
  obterFatoresRiscoQueda,
  obterCategoriasMedicamentoQueda
};
