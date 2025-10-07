import { transacaoService } from "@/services/transacoes/transacao-service";
import { useQuery } from "@tanstack/react-query";

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
    queryKey: ["resumo-financeiro", { dataInicio, dataFim }],
    queryFn: () => transacaoService.getResumo(dataInicio, dataFim),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos - evita refetch automático
    gcTime: 10 * 60 * 1000, // 10 minutos - mantém cache por mais tempo
    refetchOnWindowFocus: false, // Não refaz a query ao focar na janela
  });
}
