import { categoriaService } from "@/services/categorias/categoria-service";
import type { CreateCategoriaRequest } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook para criar uma nova categoria
 */
export function useCategoriaCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoriaRequest) => categoriaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias-list"] });
    },
  });
}
