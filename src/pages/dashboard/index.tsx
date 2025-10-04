import { TransacaoModal } from "@/components/transacaoModal";
import { useMonthSelector } from "@/hooks/use-month-selector";
import { useModalStore } from "@/stores/modals/use-modal-store";
import { calcularResumoFinanceiro } from "@/utils/financeiro";
import { useResumoFinanceiro } from "../../hooks/queries/resumo-financeiro/use-resumo-financeiro";
import { useTransacoesList } from "../../hooks/queries/transacoes/use-transacoes-list";
import { DashboardHeader } from "./components/DashboardHeader";
import { RecentTransactions } from "./components/RecentTransactions";
import { SummaryCards } from "./components/SummaryCards";
import { TrendChart } from "./components/TrendChart";

export function Dashboard() {
  const { createTransacaoOpen, setCreateTransacaoOpen } = useModalStore();

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

  // Buscar transações do mês para cálculos precisos
  const { data: transacoesMes, isLoading: loadingMes } = useTransacoesList({
    page: 0,
    size: 1000, // Buscar todas as transações do mês
    dataInicio,
    dataFim,
  });

  // Buscar resumo financeiro do mês selecionado - TESTANDO ENDPOINT CORRIGIDO
  const {
    data: resumoFinanceiro,
    isLoading: loadingResumo,
    error,
  } = useResumoFinanceiro({ dataInicio, dataFim, enabled: true });

  const isLoading = loadingRecentes || loadingResumo || loadingMes;

  if (error) {
    return (
      <div className="text-red-500">
        Erro ao carregar dados: {JSON.stringify(error)}
      </div>
    );
  }

  const transacoesRecentesList = transacoesRecentes?.content || [];
  const todasTransacoesMes = transacoesMes?.content || [];

  const resumoApi = resumoFinanceiro
    ? {
        saldo: resumoFinanceiro.saldo ?? 0,
        receitas:
          resumoFinanceiro.receitas ?? resumoFinanceiro.totalReceitas ?? 0,
        despesas:
          resumoFinanceiro.despesas ?? resumoFinanceiro.totalDespesas ?? 0,
        economias:
          (resumoFinanceiro.totalReceitas ?? resumoFinanceiro.receitas ?? 0) -
          (resumoFinanceiro.totalDespesas ?? resumoFinanceiro.despesas ?? 0),
        totalTransacoes: resumoFinanceiro.totalTransacoes ?? 0,
      }
    : null;

  // Se houver transações, calcular o resumo localmente
  const resumoData =
    todasTransacoesMes.length > 0
      ? calcularResumoFinanceiro(
          todasTransacoesMes.map((t) => ({
            id: t.id,
            tipo: t.tipo,
            valor: t.valor,
            dataTransacao: t.dataTransacao,
          }))
        )
      : null;

  // Fallback: usar dados calculados localmente ou dados vazios
  const resumoFinal = resumoApi ||
    resumoData || {
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
        isLoadingMonth={loadingMes || loadingResumo}
      />

      <SummaryCards data={resumoFinal} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart />

        <RecentTransactions
          transacoes={transacoesRecentesList}
          isLoading={loadingRecentes}
        />
      </div>

      <TransacaoModal
        open={createTransacaoOpen}
        onClose={() => setCreateTransacaoOpen(false)}
      />
    </div>
  );
}
