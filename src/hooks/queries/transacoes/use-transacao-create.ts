import type { TransacaoListResponse } from "@/services/transacoes/transacao-service";
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

      // WORKAROUND: Atualizar cache manualmente já que backend retorna lista vazia
      // Adicionar a nova transação no cache de todas as queries de lista
      queryClient.setQueriesData<TransacaoListResponse>(
        { queryKey: ["transacoes-list"], exact: false },
        (oldData) => {
          if (!oldData) {
            return {
              content: [data],
              totalElements: 1,
              totalPages: 1,
              number: 0,
              size: 10,
            };
          }

          // Adicionar no início do array (mais recente primeiro)
          return {
            ...oldData,
            content: [data, ...oldData.content],
            totalElements: oldData.totalElements + 1,
          };
        }
      );

      // NÃO invalidar transacoes-list para manter cache local
      // Quando backend for corrigido, remover o workaround acima e descomentar linha abaixo:
      // await queryClient.invalidateQueries({ queryKey: ["transacoes-list"], exact: false });

      // Invalidar resumo financeiro
      await queryClient.invalidateQueries({
        queryKey: ["resumo-financeiro"],
        exact: false,
      });
      await queryClient.refetchQueries({
        queryKey: ["resumo-financeiro"],
        exact: false,
      });

      // Invalidar dados de tendência do gráfico
      await queryClient.invalidateQueries({
        queryKey: ["transacoes-trend"],
        exact: false,
      });

      // Chamar callback opcional se fornecido
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
