import axios from 'axios';
import { ApiResponse } from '../interfaces/padroes';
import { obterSetores } from './comum.service';

export interface DadosPacienteRam {
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

export interface DadosNotificadorRam {
    idNotificador: number;
    nome: string;
    email: string;
    telefone: string;
    setor: number;
    categoria: string;
    funcionarioGerenciaRisco: boolean;
}

export interface DadosRam {
    idPaciente: number;
    idSetor: number;
    idTipoIncidente: number; // 1
    idNotificador: number;
    dataInicio: string;
    dataFim: string;
    descricao: string;
    dataNotificacao: string;
    classificacaoIncidente: string;
    classificacaoDano: string;
    idRam: number;
}

export interface DetalheRam {
    idMedicamento: number;
    nomeGenerico: string;
    fabricante: string;
    lote: string;
    validade: string | null;
    acaoAdotada: string;
    medProvavelCausador: boolean;
    posologia: string;
    indicacao: string;
    dataInicioMed: string | null;
    dataFimMed: string | null;
    idDesfecho: number;
    descricaoDesfecho: string;
    idViaAdm: number;
    descricaoViaAdm: string;
}

export interface PayloadRam {
    dadosPaciente: DadosPacienteRam;
    dadosNotificador: DadosNotificadorRam;
    dadosRam: DadosRam;
    detalhesRam: DetalheRam[];
}

export interface Desfecho {
    idDesfecho: number;
    descricaoDesfecho: string;
}

const API_BASE_URL = 'https://vigisaude.cleitonween.com.br';

export const criarNotificacaoReacaoAdversa = async (
    dados: PayloadRam
): Promise<ApiResponse> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/Ram/RegistrarRam`,
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

export const getTodasRams = async (): Promise<ApiResponse> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/Ram/GetTodasRams?tipoIncidente=1`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000
        });

        console.log('Resposta da API:', response.data);

        return {
            success: true,
            data: response.data as PayloadRam[],
            message: 'Reações adversas recuperadas com sucesso!'
        };

    } catch (error) {
        console.error('Erro ao recuperar reações adversas:', error);

        return {
            success: false,
            message: error instanceof Error ? error.message : 'Erro desconhecido ao recuperar reações adversas',
            errors: [error instanceof Error ? error.message : 'Erro desconhecido']
        };
    }
};

export const getRamPorId = async (idIncidente: number): Promise<ApiResponse> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/Ram/GetRamPorId?idIncidente=${idIncidente}&tipoIncidente=1`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000
        });

        console.log('Resposta da API:', response.data);

        return {
            success: true,
            data: response.data as PayloadRam,
            message: 'Reação adversa recuperada com sucesso!'
        };

    } catch (error) {
        console.error('Erro ao recuperar reação adversa:', error);

        return {
            success: false,
            message: error instanceof Error ? error.message : 'Erro desconhecido ao recuperar reação adversa',
            errors: [error instanceof Error ? error.message : 'Erro desconhecido']
        };
    }
};

export const putRam = async (idIncidente: number, dados: PayloadRam): Promise<ApiResponse> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/Ram/AtualizarRam/${idIncidente}`, dados, {
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
            message: 'Reação adversa atualizada com sucesso!'
        };

    } catch (error) {
        console.error('Erro ao atualizar reação adversa:', error);

        return {
            success: false,
            message: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar reação adversa',
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
    getTodasRams,
    getRamPorId,
    putRam,
    obterDesfechos,
    obterSetores
};
