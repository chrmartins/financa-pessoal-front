import { transacaoService } from "@/services/transacoes/transacao-service";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para buscar uma transação específica por ID
 */
export function useTransacaoDetail(id: string) {
  return useQuery({
    queryKey: ["transacao-detail", id],
    queryFn: () => transacaoService.getById(id),
    enabled: !!id,
  });
}
