// Interfaces básicas baseadas no schema do banco de dados

export interface DadosPaciente {
  nome: string; // Nome VARCHAR(45)
  prontuario: string; // Prontuario VARCHAR(45)
  setor: string; // Setor_idSetor - será convertido para ID no backend
  leito?: string; // Leito VARCHAR(10) - opcional
  sexo: string; // Sexo VARCHAR(15)
  peso?: string; // Peso DECIMAL - opcional
  dataNascimento: string; // DataNascimento DATE
  horaNascimento?: string; // HoraNascimento TIME - opcional
  dataAdmissao?: string; // DataAdmissao DATE - opcional
}

export interface DadosNotificador {
  nome?: string; // Nome VARCHAR(45) - opcional
  email?: string; // Email VARCHAR(45) - opcional
  telefone?: string; // Telefone VARCHAR(45) - opcional
  tipo: string; // Para compatibilidade com o form atual - será convertido para funcionarioGerenciaRisco
  funcionarioGerenciaRisco?: boolean; // FuncionarioGerenciaRisco BOOLEAN
  setor: string; // Setor_idSetor - será convertido para ID no backend
  categoria: string; // Para compatibilidade com o form atual
  categoriaProfissional?: string; // CategoriaProfissional VARCHAR(45) - opcional
}

export interface DadosIncidenteBase {
  dataInicio: string; // DataInicio DATE
  dataFim?: string; // DataFim DATE - opcional
  descricao: string; // Descricao TEXT
  dataNotificacao?: string; // DataNotificacao DATE - opcional
  classificacaoIncidente?: string; // ClassificacaoIncidente VARCHAR(45) - opcional
  classificacaoDano?: string; // ClassificacaoDano VARCHAR(45) - opcional
}

export interface DadosMedicamento {
  nomeGenerico?: string; // NomeGenerico VARCHAR(45)
  fabricante?: string; // Fabricante VARCHAR(45)
  lote?: string; // Lote VARCHAR(45)
  validade?: string; // Validade DATE
}

export interface PayloadNotificacao {
  dadosPaciente: DadosPaciente;
  dadosNotificador: DadosNotificador;
  dadosIncidente: DadosIncidenteBase;
}

// Interface para resposta da API
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}