import axios from 'axios';
import { ApiResponse } from '../interfaces/padroes';
import { obterSetores } from './comum.service';

export interface DadosPacienteFlebite {
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

export interface DadosNotificadorFlebite {
    idNotificador: number;
    nome: string;
    email: string;
    telefone: string;
    setor: number;
    categoria: string;
    funcionarioGerenciaRisco: boolean;
}

export interface MedicamentoFlebite {
    idMedicamento: number;
    nomeGenerico: string;
    fabricante?: string;
    lote?: string;
    validade?: string;
    diluente?: string;
    modoInfusao?: string;
}

export interface DadosFormularioFlebite {
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
    idFlebite?: number;
    diagnostico: string;
    grauFlebite: string;
    localPuncao: string;
    qtdPuncoesAteIncidente: number;
    tipoCateter: string;
    calibreCateter: string;
    numCateteresInseridos: number;
    tempoPermanenciaAcesso: number;
    qtdMedVesicanteIrritante: number;
    medicamentos: MedicamentoFlebite[];
}

export interface PayloadNotificacaoFlebite {
    dadosPaciente: DadosPacienteFlebite;
    dadosFlebite: DadosFormularioFlebite;
    dadosNotificador: DadosNotificadorFlebite;
    medicamentos?: MedicamentoFlebite[];
}

const API_BASE_URL = 'http://187.110.234.72:5505';

export const criarNotificacaoFlebite = async (
    dados: PayloadNotificacaoFlebite
): Promise<ApiResponse> => {
    try {
        const payload = {
            ...dados,
            dadosFlebite: {
                ...dados.dadosFlebite,
                medicamentos: dados.dadosFlebite.medicamentos || []
            },
            medicamentos: dados.medicamentos ?? dados.dadosFlebite.medicamentos,
            dataNotificacao: new Date().toISOString(),
        };

        const response = await axios.post(
            `${API_BASE_URL}/api/Flebite`,
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
            message: 'Notificação de flebite criada com sucesso!'
        };

    } catch (error) {
        console.error('Erro ao criar notificação de flebite:', error);

        return {
            success: false,
            message: error instanceof Error ? error.message : 'Erro desconhecido ao criar notificação',
            errors: [error instanceof Error ? error.message : 'Erro desconhecido']
        };
    }
};

export default {
    criarNotificacaoFlebite,
    obterSetores
};
