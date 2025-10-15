import type { TransacaoListResponse } from "@/services/transacoes/transacao-service";
import { transacaoService } from "@/services/transacoes/transacao-service";
import { useUserStore } from "@/stores/auth/use-user-store";
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
  const userId = useUserStore((state) => state.user?.id);

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
      // await queryClient.invalidateQueries({ queryKey: ["transacoes-list", userId], exact: false });

      // ✅ Invalidar queries de preview (para transações FIXA recém-criadas)
      await queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            Array.isArray(queryKey) && queryKey[0] === "transacoes-preview"
          );
        },
      });

      // Invalidar resumo financeiro (incluindo userId na chave)
      await queryClient.invalidateQueries({
        queryKey: ["resumo-financeiro", userId],
        exact: false,
      });

      // Invalidar dados de tendência do gráfico (incluindo userId na chave)
      await queryClient.invalidateQueries({
        queryKey: ["transacoes-trend", userId],
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
