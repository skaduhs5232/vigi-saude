import axios from 'axios';
import { ApiResponse } from '../interfaces/padroes';
import { obterSetores } from './comum.service';

export interface DadosPacienteErro {
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

export interface DadosNotificadorErro {
    idNotificador: number;
    nome: string;
    email: string;
    telefone: string;
    setor: number;
    categoria: string;
    funcionarioGerenciaRisco: boolean;
}

export interface DadosErroMedicacao {
    idPaciente: number;
    idSetor: number;
    idTipoIncidente: number;
    idNotificador: number;
    dataInicio: string;
    dataFim: string;
    descricao: string;
    dataNotificacao: string;
    classificacaoIncidente: string;
    classificacaoDano: string;
    idErroMedicacao: number;
}

export interface DetalheErro {
    idMedicamento: number;
    nomeGenerico: string;
    fabricante: string;
    lote: string;
    validade: string | null;
    ocorrencia: string;
    resultouEfeitoNocivo: string;
    descricaoEfeitoNocivo: string;
    causaErro: string;
    idDesfecho: number;
    descricaoDesfecho: string;
    idViaAdm: number;
    descricaoViaAdm: string;
    posologia: string;
    dataInicioMed: string | null;
    dataFimMed: string | null;
    indicacao: string;
}

export interface PayloadErroMedicacao {
    dadosPaciente: DadosPacienteErro;
    dadosNotificador: DadosNotificadorErro;
    dadosErroMedicacao: DadosErroMedicacao;
    detalhesErros: DetalheErro[];
}

export interface Desfecho {
    idDesfecho: number;
    descricaoDesfecho: string;
}

const API_BASE_URL = 'http://187.110.234.72:5505';

export const criarNotificacaoErroMedicacao = async (
    dados: PayloadErroMedicacao
): Promise<ApiResponse> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/ErroMedicacao/RegistrarErroMedicacao`,
            dados,
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

export const getTodosErrosMedicacao = async (): Promise<ApiResponse> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/ErroMedicacao/GetTodosErrosMedicacao?tipoIncidente=2`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000
        });

        console.log('Resposta da API:', response.data);

        return {
            success: true,
            data: response.data as PayloadErroMedicacao[],
            message: 'Erros de medicação recuperados com sucesso!'
        };

    } catch (error) {
        console.error('Erro ao recuperar erros de medicação:', error);

        return {
            success: false,
            message: error instanceof Error ? error.message : 'Erro desconhecido ao recuperar erros de medicação',
            errors: [error instanceof Error ? error.message : 'Erro desconhecido']
        };
    }
};

export const getErroMedicacaoPorId = async (idIncidente: number): Promise<ApiResponse> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/ErroMedicacao/GetErroMedicacaoPorId?idIncidente=${idIncidente}&tipoIncidente=2`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000
        });

        console.log('Resposta da API:', response.data);

        return {
            success: true,
            data: response.data as PayloadErroMedicacao,
            message: 'Erro de medicação recuperado com sucesso!'
        };

    } catch (error) {
        console.error('Erro ao recuperar erro de medicação:', error);

        return {
            success: false,
            message: error instanceof Error ? error.message : 'Erro desconhecido ao recuperar erro de medicação',
            errors: [error instanceof Error ? error.message : 'Erro desconhecido']
        };
    }
};

export const putErroMedicacao = async (idIncidente: number, dados: PayloadErroMedicacao): Promise<ApiResponse> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/ErroMedicacao/AtualizarErroMedicacao/${idIncidente}`, dados, {
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
            message: 'Erro de medicação atualizado com sucesso!'
        };

    } catch (error) {
        console.error('Erro ao atualizar erro de medicação:', error);

        return {
            success: false,
            message: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar erro de medicação',
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
    getTodosErrosMedicacao,
    getErroMedicacaoPorId,
    putErroMedicacao,
    obterDesfechos,
    obterSetores
};
