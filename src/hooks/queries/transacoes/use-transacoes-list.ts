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
  console.log("🔍 useTransacoesList - Query Key:", queryKey);
  console.log("🔍 useTransacoesList - Params:", params);

  const result = useQuery({
    queryKey,
    queryFn: () => {
      console.log("📡 EXECUTANDO FETCH - transacoes com params:", params);
      return transacaoService.list(params);
    },
    select: (data) => {
      // Ordenar transações por dataCriacao em ordem decrescente (mais recente primeiro)
      const transacoesOrdenadas = [...data.content].sort((a, b) => {
        const dateA = new Date(a.dataCriacao).getTime();
        const dateB = new Date(b.dataCriacao).getTime();
        return dateB - dateA; // Decrescente: mais recente criada primeiro
      });

      return {
        ...data,
        content: transacoesOrdenadas,
      };
    },
  });

  // Log do resultado
  if (result.data) {
    console.log(
      "✅ FETCH SUCCESS - transacoes recebidas:",
      result.data.content.length
    );
  }
  if (result.error) {
    console.log("❌ FETCH ERROR:", result.error);
  }

  return result;
}
