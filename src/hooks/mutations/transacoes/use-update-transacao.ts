import { transacaoService } from "@/services/transacoes/transacao-service";
import type { TransacaoResponse, UpdateTransacaoRequest } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateTransacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTransacaoRequest }) =>
      transacaoService.update(id, data),
    onSuccess: (data: TransacaoResponse) => {
      // Invalidar e refetch da lista de transações
      queryClient.invalidateQueries({ queryKey: ["transacoes"] });

      toast.success("Transação atualizada com sucesso!", {
        description: `${data.descricao} foi atualizada.`,
      });
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar transação:", error);
      toast.error("Erro ao atualizar transação", {
        description: error?.message || "Ocorreu um erro inesperado.",
      });
    },
  });
};
