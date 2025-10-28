import axios from "axios";

export interface TipoNotificacaoMensal {
    mes: string;
    ano: string;
    buscaAtiva: number;
    notificacaoVoluntaria: number;
}


const API_BASE_URL = 'http://187.110.234.72:5505';
 

export const TipoNotificacaoMes = async (): Promise<TipoNotificacaoMensal> => {
    try {
        

        const response = await axios.get(
            `${API_BASE_URL}/api/tipoMensal`,
           
        );

        console.log('Resposta da API:', response.data);

        return {
            mes: response.data.mes,
            ano: response.data.ano,
            buscaAtiva: response.data.buscaAtiva,
            notificacaoVoluntaria: response.data.notificacaoVoluntaria
        };

    } catch (error) {
        console.error('Erro ao criar notificação de flebite:', error);

        return {
            mes: '',
            ano: '',
            buscaAtiva: 0,
            notificacaoVoluntaria: 0
        };
    }
};


export default {
    TipoNotificacaoMes
};
