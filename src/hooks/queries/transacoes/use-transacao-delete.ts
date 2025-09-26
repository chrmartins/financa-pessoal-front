import { transacaoService } from "@/services/transacoes/transacao-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook para deletar uma transação
 */
export function useTransacaoDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transacaoService.delete(id),
    onSuccess: () => {
      console.log("🔄 Exclusão: Invalidando queries...");

      // Invalida todas as queries de transações-list
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && queryKey[0] === "transacoes-list";
        },
      });

      // Invalida todas as queries de resumo-financeiro
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && queryKey[0] === "resumo-financeiro";
        },
      });

      console.log("✅ Exclusão: Queries invalidadas");
    },
  });
}
