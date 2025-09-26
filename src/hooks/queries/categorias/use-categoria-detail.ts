import { categoriaService } from "@/services/categorias/categoria-service";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para buscar uma categoria específica por ID
 */
export function useCategoriaDetail(id: number) {
  return useQuery({
    queryKey: ["categoria-detail", id],
    queryFn: () => categoriaService.getById(id),
    enabled: !!id,
  });
}
