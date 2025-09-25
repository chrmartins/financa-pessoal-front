import { transacaoService } from "@/services/transacoes/transacao-service";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../query-keys";

/**
 * Hook para buscar resumo financeiro com filtros de data opcionais
 */
export function useResumoFinanceiro(dataInicio?: string, dataFim?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.resumoFinanceiro({ dataInicio, dataFim }),
    queryFn: () => transacaoService.getResumo(dataInicio, dataFim),
  });
}
