export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  
  endpoints: {
    notificacoes: '/notificacoes',
    
    lesaoPressao: '/notificacoes/lesao-pressao',
    queda: '/notificacoes/queda',
    flebite: '/notificacoes/flebite',
    reacaoAdversa: '/notificacoes/reacao-adversa',
    erroMedicacao: '/notificacoes/erro-medicacao',
    
    auth: '/auth',
    usuarios: '/usuarios',
    relatorios: '/relatorios'
  },
  
  timeout: 80000, // 80 segundos

  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseUrl}${endpoint}`;
};

export const getAuthHeaders = (token?: string): HeadersInit => {
  const headers: Record<string, string> = { ...API_CONFIG.defaultHeaders };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

export default API_CONFIG;