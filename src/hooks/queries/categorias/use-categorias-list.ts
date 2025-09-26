import { categoriaService } from "@/services/categorias/categoria-service";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para buscar lista de todas as categorias
 */
export function useCategoriasList() {
  return useQuery({
    queryKey: ["categorias-list"],
    queryFn: categoriaService.list,
  });
}
