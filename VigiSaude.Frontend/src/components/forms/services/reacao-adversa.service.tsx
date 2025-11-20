import axios from "axios";

// ✅ CORRIGIR IMPORTS
import type { ApiResponse } from "../interfaces/padroes";

// ✅ Definir interfaces localmente
interface DadosPaciente {
  idPaciente?: number;
  nome: string;
  prontuario: string;
  leito: string;
  sexo: string;
  peso: number;
  dataNascimento: string;
  horaNascimento: string;
  dataAdmissao: string;
}

interface DadosNotificador {
  idNotificador?: number;
  nome: string;
  email: string;
  telefone: string;
  setor: number | string;
  categoria: string;
  funcionarioGerenciaRisco: boolean;
}

interface Medicamento {
  nomeGenerico: string;
  fabricante?: string;
  lote?: string;
  validade?: string;
  posologia?: string;
  indicacao?: string;
  dataInicioMed?: string;
  dataFimMed?: string;
}

export interface DadosReacaoAdversa {
  reacao_dataInicio: string;
  reacao_dataFim: string;
  descricaoIncidente: string;
  descricaoReacao: string; // ✅ ADICIONAR
  reacao_desfecho: string;
  med_viaAdministracao: string;
  med_acaoAdotada?: string;
  med_provavelCausador?: string;
  classificacaoDano?: string;
}

export interface PayloadNotificacaoReacaoAdversa {
  dadosPaciente: DadosPaciente;
  dadosNotificador: DadosNotificador;
  dadosReacaoAdversa: DadosReacaoAdversa;
  medicamentos?: Medicamento[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper para mapear via de administração
function obterIdViaAdm(via: string): number {
  const mapeamento: Record<string, number> = {
    Oral: 1,
    Intramuscular: 2,
    Endovenosa: 3,
    Dérmica: 4,
    Inalatória: 5,
    Subcutânea: 6,
    Nasal: 7,
    Ocular: 8,
    Retal: 9,
    Vaginal: 10,
    Outra: 11,
  };
  return mapeamento[via] || 11;
}

export interface DesfechoOption {
  idDesfecho: number;
  descricaoDesfecho: string;
}

export const obterDesfechos = async (): Promise<DesfechoOption[]> => {
  try {
    console.log('🔍 Buscando desfechos de reação adversa...');
    const response = await axios.get(`${API_BASE_URL}/api/Desfecho/GetTodosDesfechos`); // ✅ CORRIGIDO
    
    if (response.data && Array.isArray(response.data)) {
      console.log('✅ Desfechos carregados:', response.data.length);
      return response.data;
    }
    
    console.warn('⚠️ Resposta sem array de desfechos');
    return [];
  } catch (error) {
    console.error('❌ Erro ao buscar desfechos:', error);
    return [];
  }
};


export const criarNotificacaoReacaoAdversa = async (
  dados: PayloadNotificacaoReacaoAdversa
) => {
  try {
    console.log('📤 Iniciando envio de Reação Adversa...');
    
    const payload = {
      request: {}, // ✅ ADICIONAR objeto vazio (não true, não string, mas objeto!)
      dadosPaciente: {
        idPaciente: dados.dadosPaciente.idPaciente || null,
        nome: dados.dadosPaciente.nome,
        protuario: dados.dadosPaciente.prontuario,
        leito: dados.dadosPaciente.leito,
        sexo: dados.dadosPaciente.sexo,
        peso: dados.dadosPaciente.peso,
        dataNascimento: dados.dadosPaciente.dataNascimento,
        horaNascimento: dados.dadosPaciente.horaNascimento || "00:00:00",
        dataAdmissao: dados.dadosPaciente.dataAdmissao,
      },
      dadosNotificador: {
        idNotificador: dados.dadosNotificador.idNotificador || 0, // ✅ 0 em vez de null
        nome: dados.dadosNotificador.nome,
        email: dados.dadosNotificador.email,
        telefone: dados.dadosNotificador.telefone,
        setor: dados.dadosNotificador.setor,
        categoria: dados.dadosNotificador.categoria,
        funcionarioGerenciaRisco: dados.dadosNotificador.funcionarioGerenciaRisco,
      },
      dadosRam: {
        idPaciente: dados.dadosPaciente.idPaciente || 0, // ✅ 0 em vez de null
        idSetor: dados.dadosNotificador.setor,
        idTipoIncidente: 1,
        idNotificador: dados.dadosNotificador.idNotificador || 0, // ✅ 0 em vez de null - PRINCIPAL CORREÇÃO!
        dataInicio: dados.dadosReacaoAdversa.reacao_dataInicio,
        dataFim: dados.dadosReacaoAdversa.reacao_dataFim || null,
        descricao: dados.dadosReacaoAdversa.descricaoIncidente,
        dataNotificacao: new Date().toISOString().split("T")[0],
        classificacaoIncidente: dados.dadosReacaoAdversa.classificacaoDano || "Leve",
        classificacaoDano: dados.dadosReacaoAdversa.classificacaoDano || "Leve",
        idRam: null,
      },
      detalhesRam: dados.medicamentos?.map(med => ({
        idMedicamento: null,
        nomeGenerico: med.nomeGenerico,
        fabricante: med.fabricante || null,
        lote: med.lote || null,
        validade: med.validade || null,
        acaoAdotada: dados.dadosReacaoAdversa.med_acaoAdotada || null,
        medProvavelCausador: dados.dadosReacaoAdversa.med_provavelCausador === "Sim",
        posologia: med.posologia || null,
        indicacao: med.indicacao || null,
        dataInicioMed: med.dataInicioMed || null,
        dataFimMed: med.dataFimMed || null,
        idDesfecho: typeof dados.dadosReacaoAdversa.reacao_desfecho === "string"
          ? parseInt(dados.dadosReacaoAdversa.reacao_desfecho)
          : dados.dadosReacaoAdversa.reacao_desfecho,
        descricaoDesfecho: null,
        idViaAdm: obterIdViaAdm(dados.dadosReacaoAdversa.med_viaAdministracao),
        descricaoViaAdm: null,
      })) || []
    };

    console.log('📦 Payload transformado:', JSON.stringify(payload, null, 2));

    const response = await axios.post(
      `${API_BASE_URL}/api/Ram/RegistrarRam`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Resposta:', response.data);

    return {
      success: true,
      message: 'Notificação de reação adversa criada com sucesso!',
      data: response.data,
    };
  } catch (error: any) {
    console.error('❌ Erro completo:', error);
    console.error('📋 Status:', error.response?.status);
    console.error('📋 Dados do erro:', error.response?.data);

    // ✅ LOG DETALHADO DOS ERROS
    if (error.response?.data?.errors) {
      console.error('🔴 ERROS DE VALIDAÇÃO:', JSON.stringify(error.response.data.errors, null, 2));
      
      Object.entries(error.response.data.errors).forEach(([campo, erros]) => {
        console.error(`   ❌ ${campo}:`, erros);
      });
    }

    return {
      success: false,
      message: error.response?.data?.message || 
               error.response?.data?.title ||
               'Erro ao criar notificação de reação adversa',
      error: error.response?.data,
    };
  }
};

export const buscarTodasReacoesAdversas = async (): Promise<ApiResponse> => {
  try {
    console.log('📤 [GET] Buscando TODAS as reações adversas...'); // ✅ ADICIONAR
    console.log('🔗 URL:', `${API_BASE_URL}/api/Ram/GetTodasRams`); // ✅ ADICIONAR
    
    const response = await axios.get(`${API_BASE_URL}/api/Ram/GetTodasRams`, {
      headers: {
        Accept: "application/json",
      },
    });

    console.log('✅ Status:', response.status); // ✅ ADICIONAR
    console.log('✅ Reações adversas carregadas:', response.data); // ✅ ADICIONAR
    console.log('📊 Total de registros:', response.data?.length || 0); // ✅ ADICIONAR
    
    // ✅ ADICIONAR: Mostrar cada registro
    if (Array.isArray(response.data) && response.data.length > 0) {
      response.data.forEach((ram, index) => {
        console.log(`   ${index + 1}. ID: ${ram.dadosRam?.idRam || ram.idRam || 'N/A'} | Paciente: ${ram.dadosPaciente?.nome || 'N/A'}`);
      });
    } else {
      console.warn('⚠️ Nenhuma reação adversa encontrada!');
    }

    return {
      success: true,
      data: response.data,
      message: "Reações adversas recuperadas com sucesso!",
    };
  } catch (error) {
    console.error("❌ Erro ao buscar reações adversas:", error);

    if (axios.isAxiosError(error)) {
      console.error('📋 Status:', error.response?.status);
      console.error('📋 URL:', error.config?.url);
      console.error('📋 Dados do erro:', error.response?.data);
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao buscar reações adversas",
      errors: [error instanceof Error ? error.message : "Erro desconhecido"],
    };
  }
};


export const buscarReacaoAdversaPorId = async (
  id: number
): Promise<ApiResponse> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/Ram/GetRamPorId/${id}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    return {
      success: true,
      data: response.data,
      message: "Reação adversa recuperada com sucesso!",
    };
  } catch (error) {
    console.error("❌ Erro ao buscar reação adversa:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao buscar reação adversa",
      errors: [error instanceof Error ? error.message : "Erro desconhecido"],
    };
  }
};