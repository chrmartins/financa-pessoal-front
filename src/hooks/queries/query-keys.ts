// Query Keys centralizadas para toda a aplicação
export const QUERY_KEYS = {
  // Categorias
  categorias: ["categorias"] as const,
  categoria: (id: number) => ["categorias", id] as const,

  // Transações
  transacoes: (filters?: any) => ["transacoes", filters] as const,
  transacao: (id: string) => ["transacoes", id] as const,

  // Transações Recorrentes
  transacoesRecorrentes: ["transacoes", "recorrentes"] as const,

  // Resumo Financeiro
  resumoFinanceiro: (params?: any) => ["resumo-financeiro", params] as const,
} as const;
