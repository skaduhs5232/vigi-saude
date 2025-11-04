import axios from 'axios';
import { DadosNotificador, DadosPaciente, PayloadNotificacao, ApiResponse } from '../interfaces/padroes';
import { 
  TipoQueda, 
  LocalQueda, 
  FatorRiscoQueda, 
  CategoriaMedicamentoQueda,
  obterTiposQueda,
  obterLocaisQueda,
  obterFatoresRiscoQueda,
  obterCategoriasMedicamentoQueda
} from './comum.service';


export interface CategoriaMedicamentoQuedaDTO {
  idCategoriaMedicamentoQueda: number;
  descricaoCategoria: string;
  descricaoMeds: string;
}

export interface FatorRiscoQuedaDTO {
  idFatorRiscoQueda: number;
  descricaoFator: string;
}

export interface DadosFormularioQueda {
  idPaciente: number;
  idSetor: number;
  idTipoIncidente: number;
  idNotificador: number;
  idadeMomentoValor?: number;
  idadeMomentoUnidade?: string;
  dataAdmissao: string;
  dataInicio: string;
  dataFim: string;
  descricao: string;
  dataNotificacao: string;
  classificacaoIncidente: string;
  classificacaoDano: string;
  idQueda: number;
  diagnostico: string;
  avaliacaoRiscoAdmissao: boolean;
  registroOrientacaoProntuario: boolean;
  riscoIdentificadoAdmissao: boolean;
  pacienteComAcompanhante: boolean;
  qtdMedBaixoRisco: number;
  qtdMedMedioRisco: number;
  qtdMedAltoRisco: number;
  tipoQuedaId: number;
  localQuedaId: number;
  horario?: string | null;
  turno: string;
  desfecho: string;
  categoriasMedicamento: CategoriaMedicamentoQuedaDTO[];
  fatoresRisco: FatorRiscoQuedaDTO[];
}

export interface PayloadNotificacaoQueda {
  dadosPaciente: DadosPaciente;
  dadosNotificador: DadosNotificador;
  dadosQueda: DadosFormularioQueda;
}

const API_BASE_URL = 'http://187.110.234.72:5505';

export const criarNotificacaoQueda = async (
  dados: PayloadNotificacaoQueda
): Promise<ApiResponse> => {
  try {
    const payload = {
      ...dados,
      dataNotificacao: new Date().toISOString(),
    };

    const response = await axios.post(
      `${API_BASE_URL}/api/Queda`,
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
      message: 'Notificação de queda criada com sucesso!'
    };

  } catch (error) {
    console.error('Erro ao criar notificação de queda:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao criar notificação',
      errors: [error instanceof Error ? error.message : 'Erro desconhecido']
    };
  }
};

export const GetTodasQuedas = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}//api/Queda/GetTodasQuedas?tipoincidente=5`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    console.log('Resposta da API:', response.data);

    return {
      success: true,
      data: response.data as PayloadNotificacaoQueda[],
      message: 'Queda recuperada com sucesso!'
    };

  } catch (error) {
    console.error('Erro ao recuperar Quedas:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao recuperar quedas.',
      errors: [error instanceof Error ? error.message : 'Erro desconhecido']
    };
  }
};

export const GetQuedaPorId = async (codigoQueda: number): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Queda/GetQuedaPorId?idIncidente=${codigoQueda}&tipoincidente=5`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    console.log('Resposta da API:', response.data);

    return {
      success: true,
      data: response.data as PayloadNotificacaoQueda,
      message: 'Queda recuperada com sucesso!'
    };

  } catch (error) {
    console.error('Erro ao recuperar queda:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao recuperar quedas.',
      errors: [error instanceof Error ? error.message : 'Erro desconhecido']
    };
  }
};

export const PutQueda = async (codigoQueda: number, objQueda: PayloadNotificacaoQueda): Promise<ApiResponse> => {
   try {
    const response = await axios.put(`${API_BASE_URL}/api/Queda/AtualizarQueda/{idIncidente}/${codigoQueda}`, objQueda, {
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
      message: 'Queda por pressão atualizadas com sucesso!'
    };

  } catch (error) {
    console.error('Erro ao recuperar queda por pressão:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao recuperar queda',
      errors: [error instanceof Error ? error.message : 'Erro desconhecido']
    };
  }
};

export default {
  criarNotificacaoQueda,
  obterTiposQueda,
  obterLocaisQueda,
  obterFatoresRiscoQueda,
  obterCategoriasMedicamentoQueda
};
