import { transacaoService } from "@/services/transacoes/transacao-service";
import { useUserStore } from "@/stores/auth/use-user-store";
import { useQuery } from "@tanstack/react-query";

export interface ComparisonData {
  category: string;
  mesAtual: number;
  mesAnterior: number;
  categoriaId: string;
}

interface UseComparisonDataParams {
  mes: number; // 0-11 (Janeiro = 0, Dezembro = 11)
  ano: number;
  enabled?: boolean;
}

/**
 * Hook para buscar dados de comparação entre mês atual e mês anterior
 * Agrupa despesas por categoria
 */
export function useComparisonData(params: UseComparisonDataParams) {
  const userId = useUserStore((state) => state.user?.id);
  const { mes, ano, enabled = true } = params;

  return useQuery({
    queryKey: ["comparison-data", userId, mes, ano],
    queryFn: async (): Promise<ComparisonData[]> => {
      // Calcular datas do mês atual
      const dataInicioAtual = new Date(ano, mes, 1);
      const dataFimAtual = new Date(ano, mes + 1, 0, 23, 59, 59);

      // Calcular datas do mês anterior
      const mesAnterior = mes === 0 ? 11 : mes - 1;
      const anoAnterior = mes === 0 ? ano - 1 : ano;
      const dataInicioAnterior = new Date(anoAnterior, mesAnterior, 1);
      const dataFimAnterior = new Date(
        anoAnterior,
        mesAnterior + 1,
        0,
        23,
        59,
        59
      );

      // Buscar transações do mês atual
      const transacoesAtual = await transacaoService.list({
        dataInicio: dataInicioAtual.toISOString().split("T")[0],
        dataFim: dataFimAtual.toISOString().split("T")[0],
        tipo: "DESPESA", // Só comparar despesas
      });

      // Buscar transações do mês anterior
      const transacoesAnterior = await transacaoService.list({
        dataInicio: dataInicioAnterior.toISOString().split("T")[0],
        dataFim: dataFimAnterior.toISOString().split("T")[0],
        tipo: "DESPESA", // Só comparar despesas
      });

      // Agrupar por categoria - mês atual
      const categoriasAtual = new Map<
        string,
        { nome: string; total: number; categoriaId: string }
      >();
      transacoesAtual.content.forEach((transacao) => {
        if (transacao.categoria) {
          const key = transacao.categoria.id;
          const existing = categoriasAtual.get(key);
          categoriasAtual.set(key, {
            nome: transacao.categoria.nome,
            total: (existing?.total || 0) + transacao.valor,
            categoriaId: transacao.categoria.id,
          });
        }
      });

      // Agrupar por categoria - mês anterior
      const categoriasAnterior = new Map<
        string,
        { nome: string; total: number }
      >();
      transacoesAnterior.content.forEach((transacao) => {
        if (transacao.categoria) {
          const key = transacao.categoria.id;
          const existing = categoriasAnterior.get(key);
          categoriasAnterior.set(key, {
            nome: transacao.categoria.nome,
            total: (existing?.total || 0) + transacao.valor,
          });
        }
      });

      // Combinar dados das duas categorias
      const allCategorias = new Set([
        ...categoriasAtual.keys(),
        ...categoriasAnterior.keys(),
      ]);

      const comparisonData: ComparisonData[] = Array.from(allCategorias)
        .map((categoriaId) => {
          const atual = categoriasAtual.get(categoriaId);
          const anterior = categoriasAnterior.get(categoriaId);

          return {
            category: atual?.nome || anterior?.nome || "Sem categoria",
            mesAtual: atual?.total || 0,
            mesAnterior: anterior?.total || 0,
            categoriaId: categoriaId,
          };
        })
        // Ordenar por valor do mês atual (maior primeiro)
        .sort((a, b) => b.mesAtual - a.mesAtual)
        // Pegar apenas top 5 categorias
        .slice(0, 5);

      return comparisonData;
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
}
