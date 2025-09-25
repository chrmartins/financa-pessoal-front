import { transacaoService } from "@/services/transacoes/transacao-service";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../query-keys";

/**
 * Parâmetros para filtrar transações
 */
export interface TransacoesParams {
  page?: number;
  size?: number;
  dataInicio?: string;
  dataFim?: string;
  categoriaId?: string;
  tipo?: "RECEITA" | "DESPESA";
}

/**
 * Hook para buscar transações com filtros opcionais
 */
export function useTransacoes(params?: TransacoesParams) {
  return useQuery({
    queryKey: QUERY_KEYS.transacoes(params),
    queryFn: () => transacaoService.list(params),
  });
}

/**
 * Hook para buscar uma transação específica por ID
 */
export function useTransacao(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.transacao(id),
    queryFn: () => transacaoService.getById(id),
    enabled: !!id,
  });
}
