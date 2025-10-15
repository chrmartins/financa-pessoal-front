import { useMonthSelector } from "@/hooks/use-month-selector";
import { useResumoFinanceiro } from "../../hooks/queries/resumo-financeiro/use-resumo-financeiro";
import { useTransacoesList } from "../../hooks/queries/transacoes/use-transacoes-list";
import { DashboardHeader } from "./components/DashboardHeader";
import { RecentTransactions } from "./components/RecentTransactions";
import { SummaryCards } from "./components/SummaryCards";
import { TrendChart } from "./components/TrendChart";

export function Dashboard() {
  // Hook para gerenciar seleção de mês
  const {
    dataInicio,
    dataFim,
    formattedMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    isCurrentMonth,
  } = useMonthSelector();

  // Buscar transações recentes do mês para exibição (5 mais recentes)
  const { data: transacoesRecentes, isLoading: loadingRecentes } =
    useTransacoesList({
      page: 0,
      size: 5,
      dataInicio,
      dataFim,
    });

  // Buscar resumo financeiro do mês selecionado
  const {
    data: resumoFinanceiro,
    isLoading: loadingResumo,
    error,
  } = useResumoFinanceiro({
    dataInicio,
    dataFim,
  });

  const isLoading = loadingRecentes || loadingResumo;

  if (error) {
    return (
      <div className="text-red-500">
        Erro ao carregar dados: {JSON.stringify(error)}
      </div>
    );
  }

  const transacoesRecentesList = transacoesRecentes?.content || [];

  // Usar dados do resumo da API (agora corrigido no backend)
  const resumoFinal = resumoFinanceiro || {
    saldo: 0,
    receitas: 0,
    despesas: 0,
    economias: 0,
    totalTransacoes: 0,
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        formattedMonth={formattedMonth}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onCurrentMonth={goToCurrentMonth}
        isCurrentMonth={isCurrentMonth}
        isLoadingMonth={loadingResumo}
      />

      <SummaryCards data={resumoFinal} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart />

        <RecentTransactions
          transacoes={transacoesRecentesList}
          isLoading={loadingRecentes}
        />
      </div>
    </div>
  );
}
