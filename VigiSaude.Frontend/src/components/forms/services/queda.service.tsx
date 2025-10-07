import axios from 'axios';
import { DadosNotificador, DadosPaciente, PayloadNotificacao, ApiResponse } from '../interfaces/padroes';

export interface DadosFormularioQueda {
  idadeMomentoValor: number;
  idadeMomentoUnidade: string;
  dataAdmissao: string;
  diagnostico: string;
  avaliacaoRiscoAdmissao: string;
  registroOrientacao: string;
  riscoQuedaIdentificado: string;
  fatoresPredisponentes: string[];
  usoMedicamentosSNC: string;
  medicamentosSNC?: string[];
  quantidadeMedicamentosBaixoRisco: number;
  quantidadeMedicamentosMedioRisco: number;
  quantidadeMedicamentosAltoRisco: number;
  acompanhante: string;
  tipoQueda: string;
  localQueda: string;
  horarioQueda: string;
  turno: string;
  consequencias: string;
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
      `${API_BASE_URL}/notificacoes/queda`,
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

export default {
  criarNotificacaoQueda
};
