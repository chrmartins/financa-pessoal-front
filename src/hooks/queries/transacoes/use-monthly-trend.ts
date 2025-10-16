import { transacaoService } from "@/services/transacoes/transacao-service";
import { useUserStore } from "@/stores/auth/use-user-store";
import { useQuery } from "@tanstack/react-query";

export interface MonthlyTrendData {
  month: string; // Ex: "Mai", "Jun", "Jul"
  receitas: number;
  despesas: number;
  saldo: number;
  mes: number; // 0-11
  ano: number;
}

interface UseMonthlyTrendParams {
  meses?: number; // Número de meses para buscar (padrão: 6)
  enabled?: boolean;
}

/**
 * Hook para buscar tendência financeira dos últimos N meses
 * Retorna receitas, despesas e saldo de cada mês
 */
export function useMonthlyTrend(params?: UseMonthlyTrendParams) {
  const userId = useUserStore((state) => state.user?.id);
  const { meses = 6, enabled = true } = params || {};

  return useQuery({
    queryKey: ["monthly-trend", userId, meses],
    queryFn: async (): Promise<MonthlyTrendData[]> => {
      const hoje = new Date();
      const resultado: MonthlyTrendData[] = [];

      // Nomes abreviados dos meses em português
      const nomesMeses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];

      // Iterar pelos últimos N meses (incluindo o atual)
      for (let i = meses - 1; i >= 0; i--) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const mes = data.getMonth();
        const ano = data.getFullYear();

        // Calcular primeiro e último dia do mês
        const dataInicio = new Date(ano, mes, 1);
        const dataFim = new Date(ano, mes + 1, 0, 23, 59, 59);

        // Buscar todas as transações do mês
        const transacoes = await transacaoService.list({
          dataInicio: dataInicio.toISOString().split("T")[0],
          dataFim: dataFim.toISOString().split("T")[0],
        });

        // Calcular totais
        let totalReceitas = 0;
        let totalDespesas = 0;

        transacoes.content.forEach((transacao) => {
          if (transacao.tipo === "RECEITA") {
            totalReceitas += transacao.valor;
          } else if (transacao.tipo === "DESPESA") {
            totalDespesas += transacao.valor;
          }
        });

        const saldo = totalReceitas - totalDespesas;

        resultado.push({
          month: nomesMeses[mes],
          receitas: totalReceitas,
          despesas: totalDespesas,
          saldo: saldo,
          mes: mes,
          ano: ano,
        });
      }

      return resultado;
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
}
