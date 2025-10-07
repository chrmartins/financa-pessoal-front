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
      console.log("🎯 HOOK - useTransacaoCreate chamado com:", data);
      return transacaoService.create(data);
    },
    onSuccess: async (data) => {
      console.log("✅ HOOK - Transação criada:", data);
      console.log(
        "🔧 WORKAROUND - Atualizando cache local (backend retorna lista vazia)"
      );

      // WORKAROUND: Atualizar cache manualmente já que backend retorna lista vazia
      // Adicionar a nova transação no cache de todas as queries de lista
      queryClient.setQueriesData<TransacaoListResponse>(
        { queryKey: ["transacoes-list"], exact: false },
        (oldData) => {
          if (!oldData) {
            console.log("📝 Cache vazio, criando novo com a transação");
            return {
              content: [data],
              totalElements: 1,
              totalPages: 1,
              number: 0,
              size: 10,
            };
          }

          console.log(
            `📝 Adicionando ao cache existente (${oldData.content.length} items)`
          );
          // Adicionar no início do array (mais recente primeiro)
          return {
            ...oldData,
            content: [data, ...oldData.content],
            totalElements: oldData.totalElements + 1,
          };
        }
      );

      console.log("✅ WORKAROUND - Cache local atualizado com a transação");

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
      console.log("♻️ HOOK - Query 'resumo-financeiro' atualizada");

      // Invalidar dados de tendência do gráfico
      await queryClient.invalidateQueries({
        queryKey: ["transacoes-trend"],
        exact: false,
      });
      console.log(
        "♻️ HOOK - Query 'transacoes-trend' invalidada (gráfico será atualizado)"
      );

      // Chamar callback opcional se fornecido
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("❌ HOOK - Erro ao criar transação:", error);
      // Chamar callback opcional se fornecido
      options?.onError?.(error);
    },
  });
}
