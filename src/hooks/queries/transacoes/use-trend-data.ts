import {
  transacaoService,
  type TransacaoListResponse,
} from "@/services/transacoes/transacao-service";
import { useUserStore } from "@/stores/auth/use-user-store";
import type { TransacaoResponse } from "@/types";
import { calcularResumoFinanceiro } from "@/utils/financeiro";
import { useQuery } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo } from "react";

export interface TrendData {
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

/**
 * Hook para buscar dados de tendência dos últimos 6 meses
 * Usa a mesma estratégia do dashboard: buscar transações + calcular localmente
 * @param options.enabled - Se false, não faz as requisições (lazy loading)
 */
export function useTrendData(options?: { enabled?: boolean }): {
  data: TrendData[];
  isLoading: boolean;
  error: unknown;
} {
  const userId = useUserStore((state) => state.user?.id);
  const { enabled = true } = options || {};

  const months = useMemo(() => {
    const reference = new Date();
    const ranges: { start: string; end: string; label: string }[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(reference, i);
      const startDate = startOfMonth(date);
      const endDate = endOfMonth(date);

      ranges.push({
        start: format(startDate, "yyyy-MM-dd"),
        end: format(endDate, "yyyy-MM-dd"),
        label: format(date, "MMM", { locale: ptBR }),
      });
    }

    return ranges;
  }, []);

  const overallRange = useMemo(() => {
    const firstMonth = months[0];
    const lastMonth = months[months.length - 1];

    return {
      start: firstMonth.start,
      end: lastMonth.end,
    };
  }, [months]);

  const trendQuery = useQuery({
    queryKey: [
      "transacoes-trend",
      userId,
      overallRange.start,
      overallRange.end,
    ],
    queryFn: () =>
      transacaoService.list({
        page: 0,
        size: 1000,
        dataInicio: overallRange.start,
        dataFim: overallRange.end,
      }),
    enabled: enabled && !!userId,
    staleTime: 10 * 60 * 1000, // ✅ 10 minutos - tendências históricas mudam raramente
    gcTime: 30 * 60 * 1000, // ✅ 30 minutos - cache longo para dados históricos
    refetchOnWindowFocus: false, // ✅ Não refaz ao focar janela
    select: (data: TransacaoListResponse) => {
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

  const isLoading = trendQuery.isLoading;
  const error = trendQuery.error ?? null;

  const data: TrendData[] = useMemo(() => {
    const todasTransacoes: TransacaoResponse[] = trendQuery.data?.content ?? [];

    return months.map((month) => {
      const inicioMes = new Date(`${month.start}T00:00:00`);
      const fimMes = new Date(`${month.end}T23:59:59`);

      const transacoesDoMes = todasTransacoes.filter((transacao) => {
        const dataTransacao = new Date(transacao.dataTransacao);
        return dataTransacao >= inicioMes && dataTransacao <= fimMes;
      });

      const resumo =
        transacoesDoMes.length > 0
          ? calcularResumoFinanceiro(
              transacoesDoMes.map((t) => ({
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
  }, [months, trendQuery.data?.content]);

  return {
    data,
    isLoading,
    error,
  };
}
