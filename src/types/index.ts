export interface Usuario {
  id: string; // UUID string
  nome: string;
  email: string;
  papel: "ADMIN" | "USER";
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string | null;
  ultimoAcesso: string | null;
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
  id: number;
  nome: string;
  descricao?: string;
  cor: string;
  usuarioId: number;
  createdAt: string;
  updatedAt: string;
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
  cor: string;
}

export interface UpdateCategoriaRequest {
  nome?: string;
  descricao?: string;
  cor?: string;
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
  quantidadeParcelas?: number; // Quantas vezes se repete (2x, 3x, etc)
  tipoRecorrencia?: "MENSAL"; // Sempre mensal por padrão
  valorTotalOriginal?: number; // Calculado automaticamente (valor × quantidade)
}

export interface UpdateTransacaoRequest {
  descricao?: string;
  valor?: number;
  dataTransacao?: string;
  tipo?: "RECEITA" | "DESPESA";
  categoriaId?: string; // UUID string como no banco real
  observacoes?: string;
  // Para recorrentes, permitir atualizar apenas a transação atual ou todas
  atualizarTodasRecorrencias?: boolean;
}

// Tipos para resposta da API
export interface CategoriaResponse {
  id: string; // UUID string como no banco real
  nome: string;
  descricao?: string;
  tipo: "RECEITA" | "DESPESA";
  ativa: boolean;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface TransacaoResponse {
  id: string; // UUID string
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
  quantidadeParcelas?: number; // Quantas vezes se repete (2x, 3x, etc)
  parcelaAtual?: number; // Qual parcela atual (1, 2, 3...)
  transacaoPaiId?: string; // ID da transação original que gerou as recorrentes
  valorTotal?: number; // Valor total (valor × quantidade)
  tipoRecorrencia?: "MENSAL"; // Sempre mensal
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
