export interface Usuario {
  id: string; // UUID string
  nome: string;
  email: string;
  papel: "ADMIN" | "USER";
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string | null;
  ultimoAcesso: string | null;
  fotoPerfil?: string | null; // URL da foto do Google OAuth
}

export interface CreateUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  papel: "ADMIN" | "USER";
  ativo: boolean;
}

export interface UpdateUsuarioRequest {
  nome?: string;
  email?: string;
  senha?: string;
  papel?: "ADMIN" | "USER";
  ativo?: boolean;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  tipo: "RECEITA" | "DESPESA";
  cor?: string;
  icone?: string;
  ativa: boolean;
  usuarioId: string;
  dataCriacao: string;
  dataAtualizacao?: string | null;
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  tipo: "RECEITA" | "DESPESA";
  categoriaId: number;
  usuarioId: number;
  categoria?: Categoria;
  createdAt: string;
  updatedAt: string;
}

// DTOs para criação e atualização
export interface CreateCategoriaRequest {
  nome: string;
  descricao?: string;
  tipo: "RECEITA" | "DESPESA";
  cor?: string;
  icone?: string;
  ativa?: boolean;
}

export interface UpdateCategoriaRequest {
  nome?: string;
  descricao?: string;
  tipo?: "RECEITA" | "DESPESA";
  cor?: string;
  icone?: string;
  ativa?: boolean;
}

export interface CreateTransacaoRequest {
  descricao: string;
  valor: number;
  dataTransacao: string;
  tipo: "RECEITA" | "DESPESA";
  categoriaId: string; // UUID string como no banco real
  observacoes?: string;
  // Campos para transações recorrentes
  recorrente: boolean;
  tipoRecorrencia?: "PARCELADA" | "FIXA"; // PARCELADA (com fim) ou FIXA (infinita)
  quantidadeParcelas?: number; // Usado quando tipoRecorrencia = PARCELADA
  frequencia?:
    | "DIARIO"
    | "SEMANAL"
    | "QUINZENAL"
    | "MENSAL"
    | "SEMESTRAL"
    | "ANUAL"; // Usado quando tipoRecorrencia = FIXA
}

export interface UpdateTransacaoRequest {
  descricao?: string;
  valor?: number;
  dataTransacao?: string;
  tipo?: "RECEITA" | "DESPESA";
  categoriaId?: string; // UUID string como no banco real
  observacoes?: string;
  // Campos para transações recorrentes
  recorrente?: boolean;
  tipoRecorrencia?: "PARCELADA" | "FIXA";
  quantidadeParcelas?: number;
  frequencia?:
    | "DIARIO"
    | "SEMANAL"
    | "QUINZENAL"
    | "MENSAL"
    | "SEMESTRAL"
    | "ANUAL";
  // Define como aplicar a edição em transações FIXA
  escopoEdicao?: "APENAS_ESTA" | "DESTA_DATA_EM_DIANTE" | "TODAS";
  // Se true, deleta ocorrências futuras ao converter FIXA → ÚNICA
  deletarOcorrenciasFuturas?: boolean;
}

// Tipos para resposta da API
export interface CategoriaResponse {
  id: string;
  nome: string;
  descricao?: string;
  tipo: "RECEITA" | "DESPESA";
  cor?: string;
  icone?: string;
  ativa: boolean;
  usuarioId: string;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface TransacaoResponse {
  id: string | null; // UUID string ou null para previsões
  descricao: string;
  valor: number;
  dataTransacao: string;
  tipo: "RECEITA" | "DESPESA";
  categoriaId: string; // UUID string como no banco real
  usuarioId: string; // UUID string como no banco real
  categoria: CategoriaResponse;
  observacoes?: string;
  dataCriacao: string;
  dataAtualizacao?: string;
  // Campos para transações recorrentes
  recorrente: boolean;
  tipoRecorrencia?: "PARCELADA" | "FIXA"; // PARCELADA (com fim) ou FIXA (infinita)
  quantidadeParcelas?: number; // Usado quando tipoRecorrencia = PARCELADA
  parcelaAtual?: number; // Qual parcela atual (1, 2, 3...)
  frequencia?:
    | "DIARIO"
    | "SEMANAL"
    | "QUINZENAL"
    | "MENSAL"
    | "SEMESTRAL"
    | "ANUAL"; // Usado quando tipoRecorrencia = FIXA
  transacaoPaiId?: string; // ID da transação original que gerou as recorrentes
  transacaoOrigemId?: string; // ID da transação origem (para transações FIXA)
  ativa?: boolean; // Se a transação fixa está ativa ou foi cancelada
}

// Tipos para filtros e paginação
export interface PaginationParams {
  page: number;
  size: number;
}

export interface TransacaoFilters extends PaginationParams {
  dataInicio?: string;
  dataFim?: string;
  categoriaId?: number;
  tipo?: "RECEITA" | "DESPESA";
}

// Tipos para estatísticas/resumo
export interface ResumoFinanceiro {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  periodo: string;
}
