import axios from 'axios';
import { DadosNotificador, DadosPaciente, PayloadNotificacao, ApiResponse, DadosMedicamento } from '../interfaces/padroes';

export interface DadosFormularioErroMedicacao {
    idadeMomentoValor: number;
    idadeMomentoUnidade: string;
    descricaoIncidente: string;
    erro_dataInicio: string;
    erro_dataFim: string;
    ocorrencia: string;
    descricaoErro: string;
    efeitoNocivo: string;
    descricaoEfeitos?: string;
    desfecho: string;
    causasErro: string[];
    localErro: string;
    med_nomeGenerico: string;
    med_posologia: string;
    med_viaAdministracao: string;
    med_dataInicio?: string;
    med_dataFim?: string;
    med_indicacao?: string;
    med_lote?: string;
    med_validade?: string;
}

export interface MedicamentoErro extends DadosMedicamento {
    posologia?: string;
    dataInicioMed?: string;
    dataFimMed?: string;
    indicacao?: string;
    viaAdministracao?: string;
    ocorrencia?: string;
    resultouEfeitoNocivo?: string;
    descricaoEfeitoNocivo?: string;
    causaErro?: string;
    desfecho?: string;
}

export interface PayloadNotificacaoErroMedicacao {
    dadosPaciente: DadosPaciente;
    dadosNotificador: DadosNotificador;
    dadosErroMedicacao: DadosFormularioErroMedicacao;
    medicamentos?: MedicamentoErro[];
}


export interface Desfecho{
		idDesfecho: number,
		descricaoDesfecho: string
	}

const API_BASE_URL = 'http://187.110.234.72:5505';

export const criarNotificacaoErroMedicacao = async (
    dados: PayloadNotificacaoErroMedicacao
): Promise<ApiResponse> => {
    try {
        const payload = {
            ...dados,
            dataNotificacao: new Date().toISOString(),
        };

        const response = await axios.post(
            `${API_BASE_URL}/notificacoes/erro-medicacao`,
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
            message: 'Notificação de erro de medicação criada com sucesso!'
        };

    } catch (error) {
        console.error('Erro ao criar notificação de erro de medicação:', error);

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
    criarNotificacaoErroMedicacao,
    obterDesfechos
};
