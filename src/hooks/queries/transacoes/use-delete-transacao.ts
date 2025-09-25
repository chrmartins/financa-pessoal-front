import { transacaoService } from "@/services/transacoes/transacao-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteTransacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => transacaoService.delete(id),
    onSuccess: () => {
      // Invalidar e refetch da lista de transações
      queryClient.invalidateQueries({ queryKey: ["transacoes"] });

      toast.success("Transação excluída com sucesso!", {
        description: "A transação foi removida permanentemente.",
      });
    },
    onError: (error: any) => {
      console.error("Erro ao excluir transação:", error);
      toast.error("Erro ao excluir transação", {
        description: error?.message || "Ocorreu um erro inesperado.",
      });
    },
  });
};
