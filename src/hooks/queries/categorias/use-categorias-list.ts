import { categoriaService } from "@/services/categorias/categoria-service";
import { useUserStore } from "@/stores/auth/use-user-store";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para buscar lista de todas as categorias
 */
export function useCategoriasList() {
  const userId = useUserStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["categorias-list", userId],
    queryFn: categoriaService.list,
    staleTime: 10 * 60 * 1000, // 10 minutos - categorias mudam raramente
    gcTime: 30 * 60 * 1000, // 30 minutos - mantém cache por muito tempo
    refetchOnWindowFocus: false, // Não refaz a query ao focar na janela
    enabled: !!userId, // Só executa a query se houver um usuário logado
  });
}
