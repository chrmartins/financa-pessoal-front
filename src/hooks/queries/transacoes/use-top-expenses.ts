import { transacaoService } from "@/services/transacoes/transacao-service";
import { useUserStore } from "@/stores/auth/use-user-store";
import { useQuery } from "@tanstack/react-query";
import type { PeriodoType } from "./use-period-metrics";

export interface TopExpenseData {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  categoryColor: string;
}

interface UseTopExpensesParams {
  periodo: PeriodoType;
  dataInicio?: Date;
  dataFim?: Date;
  limit?: number;
  enabled?: boolean;
}

// Cores pré-definidas para categorias (consistentes com outros componentes)
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
 * Hook para buscar as maiores despesas de um período
 * Ordena por valor decrescente e limita a quantidade retornada
 */
export function useTopExpenses(params: UseTopExpensesParams) {
  const userId = useUserStore((state) => state.user?.id);
  const { periodo, dataInicio, dataFim, limit = 10, enabled = true } = params;

  return useQuery({
    queryKey: ["top-expenses", userId, periodo, dataInicio, dataFim, limit],
    queryFn: async (): Promise<TopExpenseData[]> => {
      if (!userId) return [];

      const hoje = new Date();
      let periodoInicio: Date;
      let periodoFim: Date;

      // Calcular datas baseado no tipo de período
      if (periodo === "custom" && dataInicio && dataFim) {
        periodoInicio = dataInicio;
        periodoFim = dataFim;
      } else {
        switch (periodo) {
          case "month": {
            // Este mês
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
            // Trimestre atual
            const mesAtual = hoje.getMonth();
            const inicioTrimestre = Math.floor(mesAtual / 3) * 3;
            periodoInicio = new Date(hoje.getFullYear(), inicioTrimestre, 1);
            periodoFim = new Date(
              hoje.getFullYear(),
              inicioTrimestre + 3,
              0,
              23,
              59,
              59
            );
            break;
          }
          case "year": {
            // Este ano
            periodoInicio = new Date(hoje.getFullYear(), 0, 1);
            periodoFim = new Date(hoje.getFullYear(), 11, 31, 23, 59, 59);
            break;
          }
          default:
            periodoInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            periodoFim = hoje;
        }
      }

      // Buscar transações do período
      const response = await transacaoService.list({
        dataInicio: periodoInicio.toISOString().split("T")[0],
        dataFim: periodoFim.toISOString().split("T")[0],
        tipo: "DESPESA",
      });

      const transacoes = response.content || [];

      // Filtrar apenas despesas (garantir que tipo seja DESPESA)
      const apenasDispesas = transacoes.filter((t) => t.tipo === "DESPESA");

      // Eliminar duplicatas: manter apenas a transação mais recente
      // quando houver mesma descrição e valor
      const transacoesUnicas = apenasDispesas.reduce((acc, current) => {
        const chave = `${current.descricao}-${current.valor}`;
        const existing = acc.get(chave);

        if (
          !existing ||
          new Date(current.dataTransacao) > new Date(existing.dataTransacao)
        ) {
          acc.set(chave, current);
        }

        return acc;
      }, new Map());

      // Ordenar por valor (maior primeiro) e limitar
      const despesas = Array.from(transacoesUnicas.values())
        .sort((a, b) => b.valor - a.valor)
        .slice(0, limit);

      // Criar um mapa de categorias para cores consistentes
      const categoriasUnicas = Array.from(
        new Set(despesas.map((d) => d.categoria?.nome || "Sem Categoria"))
      );
      const corPorCategoria = new Map(
        categoriasUnicas.map((cat, index) => [
          cat,
          CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        ])
      );

      return despesas.map((despesa) => ({
        id: despesa.id || crypto.randomUUID(),
        description: despesa.descricao,
        category: despesa.categoria?.nome || "Sem Categoria",
        amount: despesa.valor,
        date: new Date(despesa.dataTransacao).toISOString().split("T")[0],
        categoryColor:
          corPorCategoria.get(despesa.categoria?.nome || "Sem Categoria") ||
          CATEGORY_COLORS[0],
      }));
    },
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
}
