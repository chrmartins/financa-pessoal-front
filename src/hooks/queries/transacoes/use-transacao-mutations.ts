import { transacaoService } from "@/services/transacoes/transacao-service";
import type { CreateTransacaoRequest, UpdateTransacaoRequest } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../query-keys";

/**
 * Hook para criar uma nova transação
 */
export function useCreateTransacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransacaoRequest) => transacaoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transacoes() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.transacoesRecorrentes,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.resumoFinanceiro(),
      });
    },
  });
}

/**
 * Hook para atualizar uma transação existente
 */
export function useUpdateTransacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransacaoRequest }) =>
      transacaoService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transacoes() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.transacao(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.transacoesRecorrentes,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.resumoFinanceiro(),
      });
    },
  });
}

/**
 * Hook para deletar uma transação
 */
export function useDeleteTransacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transacaoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transacoes() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.transacoesRecorrentes,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.resumoFinanceiro(),
      });
    },
  });
}
