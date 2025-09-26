import { transacaoService } from "@/services/transacoes/transacao-service";
import type { CreateTransacaoRequest, TransacaoResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Opções para o hook de criação de transações
 */
interface UseTransacaoCreateOptions {
  onSuccess?: (data: TransacaoResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook para criar uma nova transação
 */
export function useTransacaoCreate(options?: UseTransacaoCreateOptions) {
  const queryClient = useQueryClient();


  return useMutation({
    mutationFn: (data: CreateTransacaoRequest) => {
      return transacaoService.create(data);
    },
    onSuccess: async (data) => {

      // Listar TODAS as queries ativas
      const allQueries = queryClient.getQueryCache().getAll();

      // Procurar queries específicas de transacoes-list
      const transacoesQueries = allQueries.filter(
        (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "transacoes-list"
      );
      transacoesQueries.forEach((q) => {
      });

      // Abordagem 1: Por predicate
      await queryClient.invalidateQueries({
        predicate: (query) => {
          const isTransacoesList =
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === "transacoes-list";
          if (isTransacoesList) {
          }
          return isTransacoesList;
        },
      });

      // Chamar callback opcional se fornecido
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      // Chamar callback opcional se fornecido
      options?.onError?.(error);
    },
  });
}
