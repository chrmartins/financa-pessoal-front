export interface Usuario {
  id: number;
  nome: string;
  email: string;
  createdAt: string;
  updatedAt: string;
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
  categoriaId: string;
  observacoes?: string;
}

export interface UpdateTransacaoRequest {
  descricao?: string;
  valor?: number;
  dataTransacao?: string;
  tipo?: "RECEITA" | "DESPESA";
  categoriaId?: string;
  observacoes?: string;
}

// Tipos para resposta da API
export interface CategoriaResponse {
  id: string;
  nome: string;
  descricao?: string;
  tipo: "RECEITA" | "DESPESA";
  ativa: boolean;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface TransacaoResponse {
  id: number;
  descricao: string;
  valor: number;
  dataTransacao: string;
  tipo: "RECEITA" | "DESPESA";
  categoriaId: number;
  usuarioId: number;
  categoria: CategoriaResponse;
  observacoes?: string;
  dataCriacao: string;
  dataAtualizacao?: string;
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
