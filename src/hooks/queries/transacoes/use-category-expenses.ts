import { transacaoService } from "@/services/transacoes/transacao-service";
import { useUserStore } from "@/stores/auth/use-user-store";
import { useQuery } from "@tanstack/react-query";
import type { PeriodoType } from "./use-period-metrics";

export interface CategoryExpenseData {
  name: string;
  value: number;
  color: string;
  categoriaId: string;
  percentage: number;
  [key: string]: string | number | undefined;
}

interface UseCategoryExpensesParams {
  periodo: PeriodoType;
  dataInicio?: Date;
  dataFim?: Date;
  enabled?: boolean;
}

// Cores pré-definidas para categorias (consistentes com o design)
const CATEGORY_COLORS = [
  "#ef4444", // Vermelho
  "#f59e0b", // Laranja
  "#8b5cf6", // Roxo
  "#3b82f6", // Azul
  "#10b981", // Verde
  "#06b6d4", // Ciano
  "#ec4899", // Rosa
  "#f97316", // Laranja escuro
  "#6366f1", // Indigo
  "#14b8a6", // Teal
];

/**
 * Hook para buscar despesas agrupadas por categoria em um período
 */
export function useCategoryExpenses(params: UseCategoryExpensesParams) {
  const userId = useUserStore((state) => state.user?.id);
  const { periodo, dataInicio, dataFim, enabled = true } = params;

  return useQuery({
    queryKey: ["category-expenses", userId, periodo, dataInicio, dataFim],
    queryFn: async (): Promise<CategoryExpenseData[]> => {
      const hoje = new Date();
      let periodoInicio: Date;
      let periodoFim: Date;

      // Calcular datas baseado no tipo de período
      switch (periodo) {
        case "month": {
          periodoInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
          periodoFim = new Date(
            hoje.getFullYear(),
            hoje.getMonth() + 1,
            0,
            23,
            59,
            59
          );
          break;
        }

        case "quarter": {
          periodoInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1);
          periodoFim = new Date(
            hoje.getFullYear(),
            hoje.getMonth() + 1,
            0,
            23,
            59,
            59
          );
          break;
        }

        case "year": {
          periodoInicio = new Date(hoje.getFullYear(), 0, 1);
          periodoFim = new Date(hoje.getFullYear(), 11, 31, 23, 59, 59);
          break;
        }

        case "custom": {
          if (!dataInicio || !dataFim) {
            throw new Error(
              "dataInicio e dataFim são obrigatórios para período personalizado"
            );
          }
          periodoInicio = dataInicio;
          periodoFim = dataFim;
          break;
        }
      }

      // Buscar todas as despesas do período
      const transacoes = await transacaoService.list({
        dataInicio: periodoInicio.toISOString().split("T")[0],
        dataFim: periodoFim.toISOString().split("T")[0],
        tipo: "DESPESA",
        size: 10000,
      });

      // Agrupar por categoria
      const categorias = new Map<
        string,
        { nome: string; total: number; categoriaId: string }
      >();

      // FILTRO ADICIONAL: Garantir que apenas DESPESAS sejam processadas
      const despesasFiltradas = transacoes.content.filter(
        (transacao) => transacao.tipo === "DESPESA"
      );

      // Log para debug (remover em produção)
      if (transacoes.content.length !== despesasFiltradas.length) {
        console.warn(
          `⚠️ Filtro de segurança ativado: ${
            transacoes.content.length - despesasFiltradas.length
          } receitas removidas do gráfico de despesas`
        );
      }

      despesasFiltradas.forEach((transacao) => {
        if (transacao.categoria) {
          const key = transacao.categoria.id;
          const existing = categorias.get(key);
          categorias.set(key, {
            nome: transacao.categoria.nome,
            total: (existing?.total || 0) + transacao.valor,
            categoriaId: transacao.categoria.id,
          });
        } else {
          // Transações sem categoria
          const key = "sem-categoria";
          const existing = categorias.get(key);
          categorias.set(key, {
            nome: "Sem Categoria",
            total: (existing?.total || 0) + transacao.valor,
            categoriaId: key,
          });
        }
      });

      // Calcular total para percentuais
      const totalDespesas = Array.from(categorias.values()).reduce(
        (sum, cat) => sum + cat.total,
        0
      );

      // Converter para array e ordenar por valor (maior primeiro)
      const resultado = Array.from(categorias.values())
        .map((cat, index) => ({
          name: cat.nome,
          value: cat.total,
          color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
          categoriaId: cat.categoriaId,
          percentage: totalDespesas > 0 ? (cat.total / totalDespesas) * 100 : 0,
        }))
        .sort((a, b) => b.value - a.value);

      return resultado;
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
}
