import { categoriaService } from "@/services/categorias/categoria-service";
import { useUserStore } from "@/stores/auth/use-user-store";
import type { CreateCategoriaRequest } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook para criar uma nova categoria
 */
export function useCategoriaCreate() {
  const queryClient = useQueryClient();
  const userId = useUserStore((state) => state.user?.id);

  return useMutation({
    mutationFn: (data: CreateCategoriaRequest) => categoriaService.create(data),
    onSuccess: async () => {
      // Aguarda a invalidação do cache antes de continuar
      await queryClient.invalidateQueries({
        queryKey: ["categorias-list", userId],
      });
    },
  });
}
