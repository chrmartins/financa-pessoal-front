import { categoriaService } from "@/services/categorias/categoria-service";
import { useUserStore } from "@/stores/auth/use-user-store";
import type { UpdateCategoriaRequest } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook para atualizar uma categoria existente
 */
export function useCategoriaUpdate() {
  const queryClient = useQueryClient();
  const userId = useUserStore((state) => state.user?.id);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoriaRequest }) =>
      categoriaService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categorias-list", userId] });
      queryClient.invalidateQueries({
        queryKey: ["categoria-detail", variables.id],
      });
    },
  });
}
