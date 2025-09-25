import { transacaoService } from "@/services/transacoes/transacao-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteTransacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transacaoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transacoes"] });
      queryClient.invalidateQueries({ queryKey: ["resumo-financeiro"] });
    },
  });
}
