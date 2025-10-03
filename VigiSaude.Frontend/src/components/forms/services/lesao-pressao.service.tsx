import axios from 'axios';
import { DadosNotificador, DadosPaciente, PayloadNotificacao, ApiResponse } from '../interfaces/padroes';

export interface DadosFormularioLesaoPressao {
  idadeMomentoValor: number;
  idadeMomentoUnidade: string;
  dataAdmissao: string;
  dataPrimeiraAvaliacao: string;
  classificacaoRiscoBraden: string;
  totalEscores: number;
  reavaliacao48h: string;
  mobilidadePrejudicada: string;
  avaliacaoPor: string;
  registroBradenSAE: string;
  registroMobilidadeSAE: string;
  mudancaDecubito: string;
  intervaloMudanca: string;
  tempoInternacaoLesao: string;
  localLesao: string[];
  estagioLesao: string;
  usoColchaoDinamico: string;
  avaliacaoNutricionista: string;
  registroAvaliacaoNutricional: string;
  registroAvaliacaoFisioterapia: string;
  registroIncidenteEnfermagem: string;
  usoCoberturaAdequada: string;
}

export interface PayloadNotificacaoLesaoPressao {
  dadosPaciente: DadosPaciente;
  dadosNotificador: DadosNotificador;
  dadosLesaoPressao: DadosFormularioLesaoPressao;
}

const API_BASE_URL = 'http://187.110.234.72:5505';

export const criarNotificacaoLesaoPressao = async (
  dados: PayloadNotificacaoLesaoPressao
): Promise<ApiResponse> => {
  try {
    const payload = {
      ...dados,
      dataNotificacao: new Date().toISOString(),
    };

    const response = await axios.post(
      `${API_BASE_URL}/api/Incidente`,
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

export default {
  criarNotificacaoLesaoPressao
};
