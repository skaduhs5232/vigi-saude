import axios from 'axios';
import { DadosNotificador, DadosPaciente, PayloadNotificacao, ApiResponse, DadosMedicamento } from '../interfaces/padroes';
import { Setor, obterSetores } from './comum.service';

export interface DadosFormularioFlebite {
    idadeMomentoValor: number;
    idadeMomentoUnidade: string;
    dataAdmissao: string;
    diagnostico: string;
    grauFlebite: string;
    localPuncao: string;
    numeroPuncoes: number;
    tipoCateter: string;
    calibreCateter: string;
    materialCateter: string;
    numeroCateteresLumen: number;
    tempoPermanencia: string;
    dataRetirada: string;
    usoMedicamentosVesicantes: string;
    medicamentosAdministrados_medicamento: string;
    medicamentosAdministrados_diluente: string;
    medicamentosAdministrados_modoInfusao: string;
    monitoramentoCateter_data: string;
    monitoramentoCateter_registroAcesso: string;
}

export interface MedicamentoFlebite extends DadosMedicamento {
    diluente?: string;
    modoInfusao?: string;
}

export interface PayloadNotificacaoFlebite {
    dadosPaciente: DadosPaciente;
    dadosNotificador: DadosNotificador;
    dadosFlebite: DadosFormularioFlebite;
    medicamentos?: MedicamentoFlebite[];
}

const API_BASE_URL = 'http://localhost:8080';

export const criarNotificacaoFlebite = async (
    dados: PayloadNotificacaoFlebite
): Promise<ApiResponse> => {
    try {
        const payload = {
            ...dados,
            dataNotificacao: new Date().toISOString(),
        };

        const response = await axios.post(
            `${API_BASE_URL}/notificacoes/flebite`,
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
