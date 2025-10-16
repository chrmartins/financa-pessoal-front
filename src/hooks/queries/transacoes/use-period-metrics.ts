import { transacaoService } from "@/services/transacoes/transacao-service";
import { useUserStore } from "@/stores/auth/use-user-store";
import { useQuery } from "@tanstack/react-query";

export interface PeriodMetrics {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  economiaMedia: number; // Média por mês
  crescimentoReceitas: number; // Percentual
  crescimentoDespesas: number; // Percentual (negativo = redução)
  crescimentoSaldo: number; // Percentual
  crescimentoEconomia: number; // Percentual
}

export type PeriodoType = "month" | "quarter" | "year" | "custom";

interface UsePeriodMetricsParams {
  periodo: PeriodoType;
  dataInicio?: Date; // Para período personalizado
  dataFim?: Date; // Para período personalizado
  enabled?: boolean;
}

/**
 * Hook para calcular métricas financeiras de um período
 * Compara com o período anterior para calcular percentuais de crescimento
 */
export function usePeriodMetrics(params: UsePeriodMetricsParams) {
  const userId = useUserStore((state) => state.user?.id);
  const { periodo, dataInicio, dataFim, enabled = true } = params;

  return useQuery({
    queryKey: ["period-metrics", userId, periodo, dataInicio, dataFim],
    queryFn: async (): Promise<PeriodMetrics> => {
      const hoje = new Date();
      let periodoAtualInicio: Date;
      let periodoAtualFim: Date;
      let periodoAnteriorInicio: Date;
      let periodoAnteriorFim: Date;
      let mesesNoPeriodo = 1;

      // Calcular datas baseado no tipo de período
      switch (periodo) {
        case "month": {
          // Este mês
          periodoAtualInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
          periodoAtualFim = new Date(
            hoje.getFullYear(),
            hoje.getMonth() + 1,
            0,
            23,
            59,
            59
          );

          // Mês anterior
          periodoAnteriorInicio = new Date(
            hoje.getFullYear(),
            hoje.getMonth() - 1,
            1
          );
          periodoAnteriorFim = new Date(
            hoje.getFullYear(),
            hoje.getMonth(),
            0,
            23,
            59,
            59
          );
          mesesNoPeriodo = 1;
          break;
        }

        case "quarter": {
          // Últimos 3 meses (incluindo o atual)
          periodoAtualInicio = new Date(
            hoje.getFullYear(),
            hoje.getMonth() - 2,
            1
          );
          periodoAtualFim = new Date(
            hoje.getFullYear(),
            hoje.getMonth() + 1,
            0,
            23,
            59,
            59
          );

          // 3 meses anteriores
          periodoAnteriorInicio = new Date(
            hoje.getFullYear(),
            hoje.getMonth() - 5,
            1
          );
          periodoAnteriorFim = new Date(
            hoje.getFullYear(),
            hoje.getMonth() - 2,
            0,
            23,
            59,
            59
          );
          mesesNoPeriodo = 3;
          break;
        }

        case "year": {
          // Este ano (jan-dez)
          periodoAtualInicio = new Date(hoje.getFullYear(), 0, 1);
          periodoAtualFim = new Date(hoje.getFullYear(), 11, 31, 23, 59, 59);

          // Ano anterior
          periodoAnteriorInicio = new Date(hoje.getFullYear() - 1, 0, 1);
          periodoAnteriorFim = new Date(
            hoje.getFullYear() - 1,
            11,
            31,
            23,
            59,
            59
          );
          mesesNoPeriodo = 12;
          break;
        }

        case "custom": {
          // Período personalizado
          if (!dataInicio || !dataFim) {
            throw new Error(
              "dataInicio e dataFim são obrigatórios para período personalizado"
            );
          }

          periodoAtualInicio = dataInicio;
          periodoAtualFim = dataFim;

          // Calcular período anterior com mesma duração
          const diferencaDias = Math.ceil(
            (dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)
          );

          periodoAnteriorFim = new Date(dataInicio);
          periodoAnteriorFim.setDate(periodoAnteriorFim.getDate() - 1);
          periodoAnteriorInicio = new Date(periodoAnteriorFim);
          periodoAnteriorInicio.setDate(
            periodoAnteriorInicio.getDate() - diferencaDias
          );

          mesesNoPeriodo = Math.max(1, Math.ceil(diferencaDias / 30)); // Aproximação
          break;
        }
      }

      // Buscar transações do período atual
      const transacoesAtual = await transacaoService.list({
        dataInicio: periodoAtualInicio.toISOString().split("T")[0],
        dataFim: periodoAtualFim.toISOString().split("T")[0],
        size: 10000, // Buscar todas
      });

      // Buscar transações do período anterior
      const transacoesAnterior = await transacaoService.list({
        dataInicio: periodoAnteriorInicio.toISOString().split("T")[0],
        dataFim: periodoAnteriorFim.toISOString().split("T")[0],
        size: 10000, // Buscar todas
      });

      // Calcular totais do período atual
      let receitasAtual = 0;
      let despesasAtual = 0;

      transacoesAtual.content.forEach((transacao) => {
        if (transacao.tipo === "RECEITA") {
          receitasAtual += transacao.valor;
        } else if (transacao.tipo === "DESPESA") {
          despesasAtual += transacao.valor;
        }
      });

      const saldoAtual = receitasAtual - despesasAtual;
      const economiaMediaAtual = saldoAtual / mesesNoPeriodo;

      // Calcular totais do período anterior
      let receitasAnterior = 0;
      let despesasAnterior = 0;

      transacoesAnterior.content.forEach((transacao) => {
        if (transacao.tipo === "RECEITA") {
          receitasAnterior += transacao.valor;
        } else if (transacao.tipo === "DESPESA") {
          despesasAnterior += transacao.valor;
        }
      });

      const saldoAnterior = receitasAnterior - despesasAnterior;
      const economiaMediaAnterior = saldoAnterior / mesesNoPeriodo;

      // Calcular percentuais de crescimento
      const calcularPercentual = (atual: number, anterior: number): number => {
        if (anterior === 0) return atual > 0 ? 100 : 0;
        return ((atual - anterior) / anterior) * 100;
      };

      const crescimentoReceitas = calcularPercentual(
        receitasAtual,
        receitasAnterior
      );
      const crescimentoDespesas = calcularPercentual(
        despesasAtual,
        despesasAnterior
      );
      const crescimentoSaldo = calcularPercentual(saldoAtual, saldoAnterior);
      const crescimentoEconomia = calcularPercentual(
        economiaMediaAtual,
        economiaMediaAnterior
      );

      return {
        totalReceitas: receitasAtual,
        totalDespesas: despesasAtual,
        saldo: saldoAtual,
        economiaMedia: economiaMediaAtual,
        crescimentoReceitas,
        crescimentoDespesas,
        crescimentoSaldo,
        crescimentoEconomia,
      };
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
}
