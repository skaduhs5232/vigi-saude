import axios from "axios";

// ✅ CORRIGIR IMPORTS - Usar os tipos corretos do arquivo padroes.tsx
import type { ApiResponse } from "../interfaces/padroes";

// ✅ Definir interface localmente (temporário até verificar padroes.tsx)
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

interface DadosErroMedicacao {
  erro_dataInicio: string;
  erro_dataFim: string;
  descricaoIncidente: string;
  localErro: string;
  ocorrencia: string;
  efeitoNocivo: string;
  descricaoEfeitos?: string;
  causasErro: string[] | string;
  desfecho: string;
  med_nomeGenerico: string;
  med_fabricante?: string;
  med_lote?: string;
  med_validade?: string;
  med_viaAdministracao: string;
  med_posologia?: string;
  med_dataInicio?: string;
  med_dataFim?: string;
  med_indicacao?: string;
}

export interface PayloadNotificacaoErroMedicacao {
  dadosPaciente: DadosPaciente;
  dadosNotificador: DadosNotificador;
  dadosErroMedicacao: DadosErroMedicacao;
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
    console.log('🔍 Buscando desfechos de erro de medicação...');
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

export const criarNotificacaoErroMedicacao = async (
  dados: PayloadNotificacaoErroMedicacao
): Promise<ApiResponse> => {
  try {
    console.log("📤 Iniciando envio de Erro de Medicação...");

    const payload = {
      request: {}, // ✅ ADICIONAR campo obrigatório
      dadosPaciente: {
        idPaciente: dados.dadosPaciente.idPaciente || 0, // ✅ 0 em vez de null
        nome: dados.dadosPaciente.nome,
        protuario: dados.dadosPaciente.prontuario, // ✅ TYPO DO BACKEND
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
      dadosErroMedicacao: {
        idPaciente: dados.dadosPaciente.idPaciente || 0, // ✅ 0 em vez de null
        idSetor: typeof dados.dadosErroMedicacao.localErro === "string" 
          ? parseInt(dados.dadosErroMedicacao.localErro) 
          : dados.dadosErroMedicacao.localErro,
        idTipoIncidente: 2, // Erro de Medicação = 2
        idNotificador: dados.dadosNotificador.idNotificador || 0, // ✅ 0 em vez de null
        dataInicio: dados.dadosErroMedicacao.erro_dataInicio,
        dataFim: dados.dadosErroMedicacao.erro_dataFim || null,
        descricao: dados.dadosErroMedicacao.descricaoIncidente,
        dataNotificacao: new Date().toISOString().split("T")[0],
        classificacaoIncidente: dados.dadosErroMedicacao.ocorrencia || null,
        classificacaoDano: dados.dadosErroMedicacao.efeitoNocivo || "Nenhum",
        idErroMedicacao: null,
      },
      detalhesErros: [
        {
          idMedicamento: null,
          nomeGenerico: dados.dadosErroMedicacao.med_nomeGenerico,
          fabricante: dados.dadosErroMedicacao.med_fabricante || null,
          lote: dados.dadosErroMedicacao.med_lote || null,
          validade: dados.dadosErroMedicacao.med_validade || null,
          ocorrencia: dados.dadosErroMedicacao.ocorrencia || null,
          resultouEfeitoNocivo: dados.dadosErroMedicacao.efeitoNocivo || null,
          descricaoEfeitoNocivo: dados.dadosErroMedicacao.descricaoEfeitos || null,
          causaErro: Array.isArray(dados.dadosErroMedicacao.causasErro)
            ? dados.dadosErroMedicacao.causasErro.join(", ")
            : dados.dadosErroMedicacao.causasErro,
          idDesfecho: typeof dados.dadosErroMedicacao.desfecho === "string"
            ? parseInt(dados.dadosErroMedicacao.desfecho)
            : dados.dadosErroMedicacao.desfecho,
          descricaoDesfecho: null,
          idViaAdm: obterIdViaAdm(dados.dadosErroMedicacao.med_viaAdministracao),
          descricaoViaAdm: null,
          posologia: dados.dadosErroMedicacao.med_posologia || null,
          dataInicioMed: dados.dadosErroMedicacao.med_dataInicio || null,
          dataFimMed: dados.dadosErroMedicacao.med_dataFim || null,
          indicacao: dados.dadosErroMedicacao.med_indicacao || null,
        },
      ],
    };

    console.log("📦 Payload montado:", JSON.stringify(payload, null, 2));

    const response = await axios.post(
      `${API_BASE_URL}/api/ErroMedicacao/RegistrarErroMedicacao`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 30000,
      }
    );

    console.log("✅ Resposta do servidor:", response.data);

    return {
      success: true,
      data: response.data,
      message: "Erro de medicação registrado com sucesso!",
    };
  } catch (error) {
    console.error("❌ Erro ao registrar erro de medicação:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message;

      console.error("🔍 Detalhes do erro:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      // ✅ ADICIONAR log detalhado dos erros
      if (error.response?.data?.errors) {
        console.error('🔴 ERROS DE VALIDAÇÃO:', JSON.stringify(error.response.data.errors, null, 2));
        
        Object.entries(error.response.data.errors).forEach(([campo, erros]) => {
          console.error(`   ❌ ${campo}:`, erros);
        });
      }

      return {
        success: false,
        message: errorMessage,
        errors: error.response?.data?.errors || [errorMessage],
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao registrar erro de medicação",
      errors: [
        error instanceof Error ? error.message : "Erro desconhecido",
      ],
    };
  }
};


export const buscarTodosErrosMedicacao = async (): Promise<ApiResponse> => {
  try {
    console.log('📤 [GET] Buscando TODOS os erros de medicação...');
    console.log('🔗 URL:', `${API_BASE_URL}/api/ErroMedicacao/GetTodosErrosMedicacao`);
    
    const response = await axios.get(
      `${API_BASE_URL}/api/ErroMedicacao/GetTodosErrosMedicacao`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    console.log('✅ Status:', response.status);
    console.log('✅ Headers:', response.headers);
    console.log('✅ Resposta BRUTA:', response); // ✅ ADICIONAR
    console.log('✅ response.data:', response.data);
    console.log('📊 Tipo de response.data:', typeof response.data); // ✅ ADICIONAR
    console.log('📊 É array?:', Array.isArray(response.data)); // ✅ ADICIONAR
    console.log('📊 Tamanho:', response.data?.length); // ✅ ADICIONAR
    
    // ✅ ADICIONAR: Tentar acessar de várias formas
    console.log('🔍 TENTANDO ACESSAR DADOS:');
    console.log('   - response.data:', response.data);
    console.log('   - response.data.data:', response.data?.data);
    console.log('   - response.data.result:', response.data?.result);
    console.log('   - response.data.items:', response.data?.items);
    console.log('   - response.data.erros:', response.data?.erros);
    console.log('   - response.data.errosMedicacao:', response.data?.errosMedicacao);
    
    // ✅ ADICIONAR: Se for array, mostrar primeiro item
    if (Array.isArray(response.data) && response.data.length > 0) {
      console.log('📦 PRIMEIRO ITEM:', JSON.stringify(response.data[0], null, 2));
    }
    
    console.log('📊 Total de registros:', response.data?.length || 0);
    
    if (Array.isArray(response.data) && response.data.length > 0) {
      response.data.forEach((erro, index) => {
        console.log(`   ${index + 1}. Estrutura:`, Object.keys(erro));
        console.log(`      ID: ${erro.dadosErroMedicacao?.idErroMedicacao || erro.idErroMedicacao || erro.id || 'N/A'}`);
        console.log(`      Título: ${erro.titulo || erro.descricao || erro.classificacaoIncidente || 'N/A'}`);
      });
    } else {
      console.warn('⚠️ Nenhum erro de medicação encontrado!');
    }

    return {
      success: true,
      data: response.data,
      message: "Erros de medicação recuperados com sucesso!",
    };
  } catch (error) {
    console.error("❌ Erro ao buscar erros de medicação:", error);

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
          : "Erro ao buscar erros de medicação",
      errors: [error instanceof Error ? error.message : "Erro desconhecido"],
    };
  }
};

export const buscarErroMedicacaoPorId = async (
  id: number
): Promise<ApiResponse> => {
  try {
    console.log(`📤 Buscando erro de medicação ID: ${id}...`);
    
    const response = await axios.get(
      `${API_BASE_URL}/api/ErroMedicacao/GetErroMedicacaoPorId/${id}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    console.log('✅ Erro de medicação carregado:', response.data);

    return {
      success: true,
      data: response.data,
      message: "Erro de medicação recuperado com sucesso!",
    };
  } catch (error) {
    console.error("❌ Erro ao buscar erro de medicação:", error);

    if (axios.isAxiosError(error)) {
      console.error('📋 Status:', error.response?.status);
      console.error('📋 Dados do erro:', error.response?.data);
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao buscar erro de medicação",
      errors: [error instanceof Error ? error.message : "Erro desconhecido"],
    };
  }
};