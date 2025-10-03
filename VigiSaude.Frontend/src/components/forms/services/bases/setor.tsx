import axios from 'axios';

export interface DadosSetor {
    codigo: number;
    nome: string;
}

const API_BASE_URL = 'http://localhost:8080';

export const SetorService = async (): Promise<DadosSetor> => {
    try {
        const response = await axios.get<DadosSetor>(
            `${API_BASE_URL}/notificacoes/lesao-pressao`,
            {
                headers: {
                    'Accept': 'application/json'
                },
                timeout: 30000
            }
        );

        console.log('Resposta da API:', response.data);

        return response.data;
    } catch (error) {
        console.error('Erro ao obter notificação de lesão por pressão:', error);
        throw error;
    }
};

export default {
    SetorService
};
