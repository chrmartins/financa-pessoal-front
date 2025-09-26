import { calcularResumoFinanceiro } from "@/utils/financeiro";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTransacoesList } from "./use-transacoes-list";

export interface TrendData {
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

/**
 * Hook para buscar dados de tendência dos últimos 6 meses
 * Usa a mesma estratégia do dashboard: buscar transações + calcular localmente
 */
export function useTrendData(): {
  data: TrendData[];
  isLoading: boolean;
  error: any;
} {
  const today = new Date();
  const months: { start: string; end: string; label: string }[] = [];

  // Gerar as datas dos últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(today, i);
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);

    months.push({
      start: format(startDate, "yyyy-MM-dd"),
      end: format(endDate, "yyyy-MM-dd"),
      label: format(date, "MMM", { locale: ptBR }),
    });
  }

  // Buscar transações para cada mês (mesma abordagem do dashboard)
  const transacaoQueries = months.map(({ start, end }) =>
    useTransacoesList({
      page: 0,
      size: 1000,
      dataInicio: start,
      dataFim: end,
    })
  );

  // Estado de loading e erro
  const isLoading = transacaoQueries.some((query) => query.isLoading);
  const error = transacaoQueries.find((query) => query.error)?.error;

  // Combinar os dados (mesma abordagem do dashboard)
  const data: TrendData[] = months.map((month, index) => {
    const queryData = transacaoQueries[index].data;
    const transacoes = queryData?.content || [];

    // Calcular resumo localmente (como no dashboard)
    const resumo =
      transacoes.length > 0
        ? calcularResumoFinanceiro(
            transacoes.map((t) => ({
              id: t.id,
              tipo: t.tipo,
              valor: t.valor,
              dataTransacao: t.dataTransacao,
            }))
          )
        : { receitas: 0, despesas: 0, saldo: 0 };

    return {
      mes: month.label,
      receitas: resumo.receitas,
      despesas: resumo.despesas,
      saldo: resumo.saldo,
    };
  });

  return {
    data: data, // Retornar todos os 6 meses, mesmo com valores zero
    isLoading,
    error,
  };
}
