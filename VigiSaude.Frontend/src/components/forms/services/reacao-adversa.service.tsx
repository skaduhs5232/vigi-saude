import axios from 'axios';
import { DadosNotificador, DadosPaciente, PayloadNotificacao, ApiResponse, DadosMedicamento } from '../interfaces/padroes';

export interface Desfecho {
  idDesfecho: number;
  descricaoDesfecho: string;
}

export interface DadosFormularioReacaoAdversa {
  idadeMomentoValor: number;
  idadeMomentoUnidade: string;
  descricaoIncidente: string;
  descricaoReacao: string;
  reacao_dataInicio: string;
  reacao_dataFim: string;
  reacao_duracao: string;
  reacao_desfecho: string;
  med_nomeGenerico: string;
  med_provavelCausador: string;
  med_fabricante?: string;
  med_lote?: string;
  med_posologia?: string;
  med_viaAdministracao: string;
  med_dataInicio?: string;
  med_dataFim?: string;
  med_duracao?: string;
  med_indicacao?: string;
  med_acaoAdotada: string;
}

export interface MedicamentoRAM extends DadosMedicamento {
  provavelCausador?: boolean;
  posologia?: string;
  indicacao?: string;
  dataInicioMed?: string;
  dataFimMed?: string;
  viaAdministracao?: string;
  acaoAdotada?: string;
  desfecho?: string;
}

export interface PayloadNotificacaoReacaoAdversa {
  dadosPaciente: DadosPaciente;
  dadosNotificador: DadosNotificador;
  dadosReacaoAdversa: DadosFormularioReacaoAdversa;
  medicamentos?: MedicamentoRAM[];
}

const API_BASE_URL = 'http://187.110.234.72:5505';

export const criarNotificacaoReacaoAdversa = async (
  dados: PayloadNotificacaoReacaoAdversa
): Promise<ApiResponse> => {
  try {
    const payload = {
      ...dados,
      dataNotificacao: new Date().toISOString(),
    };

    const response = await axios.post(
      `${API_BASE_URL}/notificacoes/reacao-adversa`,
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
      message: 'Notificação de reação adversa criada com sucesso!'
    };

  } catch (error) {
    console.error('Erro ao criar notificação de reação adversa:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao criar notificação',
      errors: [error instanceof Error ? error.message : 'Erro desconhecido']
    };
  }
};

export const obterDesfechos = async (): Promise<Desfecho[]> => {
  try {
    const response = await axios.get<Desfecho[]>(`${API_BASE_URL}/api/Desfecho/GetTodosDesfechos`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter desfechos:', error);
    return [];
  }
};

export default {
  criarNotificacaoReacaoAdversa,
  obterDesfechos
};
