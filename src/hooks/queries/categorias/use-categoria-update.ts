import { categoriaService } from "@/services/categorias/categoria-service";
import type { UpdateCategoriaRequest } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook para atualizar uma categoria existente
 */
export function useCategoriaUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoriaRequest }) =>
      categoriaService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categorias-list"] });
      queryClient.invalidateQueries({
        queryKey: ["categoria-detail", variables.id],
      });
    },
  });
}
