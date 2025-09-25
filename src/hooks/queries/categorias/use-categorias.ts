import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../query-keys";
import { categoriaService } from "@/services/categorias/categoria-service";

/**
 * Hook para buscar todas as categorias
 */
export function useCategorias() {
  return useQuery({
    queryKey: QUERY_KEYS.categorias,
    queryFn: categoriaService.list,
  });
}

/**
 * Hook para buscar uma categoria específica por ID
 */
export function useCategoria(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.categoria(id),
    queryFn: () => categoriaService.getById(id),
    enabled: !!id,
  });
}
