import { categoriaService } from "@/services/categorias/categoria-service";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para buscar lista de todas as categorias
 */
export function useCategoriasList() {
  return useQuery({
    queryKey: ["categorias-list"],
    queryFn: categoriaService.list,
    staleTime: 10 * 60 * 1000, // 10 minutos - categorias mudam raramente
    gcTime: 30 * 60 * 1000, // 30 minutos - mantém cache por muito tempo
    refetchOnWindowFocus: false, // Não refaz a query ao focar na janela
  });
}
