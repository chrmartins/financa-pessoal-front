import { transacaoService } from "@/services/transacoes/transacao-service";
import { useUserStore } from "@/stores/auth/use-user-store";
import { useQuery } from "@tanstack/react-query";

/**
 * Parâmetros para filtrar transações
 */
export interface TransacoesParams {
  page?: number;
  size?: number;
  dataInicio?: string;
  dataFim?: string;
  categoriaId?: string;
  tipo?: "RECEITA" | "DESPESA";
}

/**
 * Hook para buscar lista de transações com filtros opcionais
 */
export function useTransacoesList(
  params?: TransacoesParams & { enabled?: boolean }
) {
  const userId = useUserStore((state) => state.user?.id);
  const { enabled = true, ...queryParams } = params || {};
  const queryKey = ["transacoes-list", userId, queryParams];

  const result = useQuery({
    queryKey,
    queryFn: () => {
      return transacaoService.list(queryParams);
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos - evita refetch desnecessário
    gcTime: 10 * 60 * 1000, // 10 minutos - mantém cache por mais tempo
    select: (data) => {
      const transacoesOrdenadas = [...data.content].sort((a, b) => {
        const dateA = new Date(a.dataCriacao).getTime();
        const dateB = new Date(b.dataCriacao).getTime();
        return dateB - dateA;
      });

      return {
        ...data,
        content: transacoesOrdenadas,
      };
    },
  });

  return result;
}
