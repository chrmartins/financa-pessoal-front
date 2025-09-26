import { categoriaService } from "@/services/categorias/categoria-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook para deletar uma categoria
 */
export function useCategoriaDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias-list"] });
    },
  });
}
