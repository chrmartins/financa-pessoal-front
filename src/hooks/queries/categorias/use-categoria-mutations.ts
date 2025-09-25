import type { CreateCategoriaRequest, UpdateCategoriaRequest } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../query-keys";
import { categoriaService } from "@/services/categorias/categoria-service";

/**
 * Hook para criar uma nova categoria
 */
export function useCreateCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoriaRequest) => categoriaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categorias });
    },
  });
}

/**
 * Hook para atualizar uma categoria existente
 */
export function useUpdateCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoriaRequest }) =>
      categoriaService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categorias });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.categoria(variables.id),
      });
    },
  });
}

/**
 * Hook para deletar uma categoria
 */
export function useDeleteCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categorias });
    },
  });
}
