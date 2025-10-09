import { categoriaService } from "@/services/categorias/categoria-service";
import { useUserStore } from "@/stores/auth/use-user-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook para deletar uma categoria
 */
export function useCategoriaDelete() {
  const queryClient = useQueryClient();
  const userId = useUserStore((state) => state.user?.id);

  return useMutation({
    mutationFn: (id: string) => categoriaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias-list", userId] });
    },
  });
}
