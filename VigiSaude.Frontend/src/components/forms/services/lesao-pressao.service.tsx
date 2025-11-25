import axios from 'axios';
import { ApiResponse } from '../interfaces/padroes';
import { obterLocaisLesao } from './comum.service';

// Interfaces específicas para Lesão por Pressão conforme Swagger
export interface DadosPacienteLesaoPressao {
  idPaciente: number;
  nome: string;
  protuario: string;
  leito: string;
  sexo: string;
  peso: number;
  dataNascimento: string;
  horaNascimento: string;
  dataAdmissao: string;
}

export interface DadosNotificadorLesaoPressao {
  idNotificador: number;
  nome: string;
  email: string;
  telefone: string;
  setor: number;
  categoria: string;
  funcionarioGerenciaRisco: boolean;
}

export interface DadosFormularioLesaoPressao {
  idPaciente?: number;
  idSetor: number;
  idTipoIncidente: number;
  idNotificador?: number;
  dataInicio: string;
  dataFim: string;
  descricao: string;
  dataNotificacao: string;
  classificacaoIncidente: string;
  classificacaoDano: string;
  idLesaoPressao?: number;
  dataPrimeiraAvaliacao: string;
  classificacaoBraden: string;
  escoreBraden: number;
  reavaliacao48Horas: string;
  mobilidadePrejudicada: boolean;
  responsavelAvaliacao: string;
  resgistroSAE: string;
  mudancaDecubito: boolean;
  intervaloMudanca: number;
  tempoInternacaoLesao: string;
  idLocalLesao: number;
  descicaoOutro: string;
  estagioLesao: string;
  superficeDinamicaApoio: boolean;
  solicitacaoAvaliacaoNutri: boolean;
  registroAvaliacaoNutri: boolean;
  registroavaliacaoFisio: boolean;
  registroEnfermagem: boolean;
  usoCoberturaAdequada: string;
}

export interface PayloadNotificacaoLesaoPressao {
  dadosPaciente: DadosPacienteLesaoPressao;
  dadosLesaoPressao: DadosFormularioLesaoPressao;
  dadosNotificador: DadosNotificadorLesaoPressao;
}

const API_BASE_URL = 'https://vigisaude.cleitonween.com.br';

export const criarNotificacaoLesaoPressao = async (
  dados: PayloadNotificacaoLesaoPressao
): Promise<ApiResponse> => {
  try {
    const payload = {
      ...dados,
      dataNotificacao: new Date().toISOString(),
    };

    const response = await axios.post(
      `${API_BASE_URL}/api/LesaoPressao`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('Resposta da API:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: 'Notificação de lesão por pressão criada com sucesso!'
    };

  } catch (error) {
    console.error('Erro ao criar notificação de lesão por pressão:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao criar notificação',
      errors: [error instanceof Error ? error.message : 'Erro desconhecido']
    };
  }
};

export const getTodasLesoesPressao = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/LesaoPressao/GetTodasLesoesPressao?tipoincidente=5`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    console.log('Resposta da API:', response.data);

    return {
      success: true,
      data: response.data as PayloadNotificacaoLesaoPressao[],
      message: 'Lesões por pressão recuperadas com sucesso!'
    };

  } catch (error) {
    console.error('Erro ao recuperar lesões por pressão:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao recuperar lesões',
      errors: [error instanceof Error ? error.message : 'Erro desconhecido']
    };
  }
};

export const getLesaoById = async (codigoLesao: number): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/LesaoPressao/GetLesaoPressaoPorId?idIncidente=${codigoLesao}&tipoincidente=5`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    console.log('Resposta da API:', response.data);

    return {
      success: true,
      data: response.data as PayloadNotificacaoLesaoPressao,
      message: 'Lesão por pressão recuperada com sucesso!'
    };

  } catch (error) {
    console.error('Erro ao recuperar lesão por pressão:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao recuperar lesão',
      errors: [error instanceof Error ? error.message : 'Erro desconhecido']
    };
  }
};

export const putLesaoPressao = async (codigoLesao: number, objLesao: PayloadNotificacaoLesaoPressao): Promise<ApiResponse> => {
   try {
    const response = await axios.put(`${API_BASE_URL}/api/LesaoPressao/AtualizarLesaoPressao/${codigoLesao}`, objLesao, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    console.log('Resposta da API:', response.data);

    return {
      success: true,
      data: response.data,
      message: 'Lesões por pressão atualizadas com sucesso!'
    };

  } catch (error) {
    console.error('Erro ao recuperar lesões por pressão:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao recuperar lesões',
      errors: [error instanceof Error ? error.message : 'Erro desconhecido']
    };
  }
};

export default {
  criarNotificacaoLesaoPressao,
  obterLocaisLesao,
  getTodasLesoesPressao,
  putLesaoPressao,
  getLesaoById
};
