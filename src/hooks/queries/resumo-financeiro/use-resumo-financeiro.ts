import { transacaoService } from "@/services/transacoes/transacao-service";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../query-keys";

interface UseResumoFinanceiroParams {
  dataInicio?: string;
  dataFim?: string;
  enabled?: boolean;
}

/**
 * Hook para buscar resumo financeiro com filtros de data opcionais
 */
export function useResumoFinanceiro(params?: UseResumoFinanceiroParams) {
  const { dataInicio, dataFim, enabled = true } = params || {};

  return useQuery({
    queryKey: QUERY_KEYS.resumoFinanceiro({ dataInicio, dataFim }),
    queryFn: () => transacaoService.getResumo(dataInicio, dataFim),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
