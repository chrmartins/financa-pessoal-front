import { transacaoService } from "@/services/transacoes/transacao-service";
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
export function useTransacoesList(params?: TransacoesParams) {
  const queryKey = ["transacoes-list", params];

  const result = useQuery({
    queryKey,
    queryFn: () => {
      return transacaoService.list(params);
    },
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

  if (result.data) {
      result.data.content.length
  }
  if (result.error) {
  }

  return result;
}
