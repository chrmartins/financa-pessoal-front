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
      await queryClient.invalidateQueries({ queryKey: ["transacoes-list"] });

      // Chamar callback opcional se fornecido
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      // Chamar callback opcional se fornecido
      options?.onError?.(error);
    },
  });
}
