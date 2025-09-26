import { transacaoService } from "@/services/transacoes/transacao-service";
import type { UpdateTransacaoRequest } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook para atualizar uma transação existente
 */
export function useTransacaoUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransacaoRequest }) =>
      transacaoService.update(id, data),
    onSuccess: (_, variables) => {
      console.log("🔄 Atualização: Invalidando queries...");

      // Invalida todas as queries de transações-list
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && queryKey[0] === "transacoes-list";
        },
      });

      // Invalida transação específica
      queryClient.invalidateQueries({
        queryKey: ["transacao-detail", variables.id],
      });

      // Invalida todas as queries de resumo-financeiro
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && queryKey[0] === "resumo-financeiro";
        },
      });

      console.log("✅ Atualização: Queries invalidadas");
    },
  });
}
