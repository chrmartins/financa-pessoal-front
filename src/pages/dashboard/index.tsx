import { TransacaoModal } from "@/components/TransacaoModal";
import { useMonthSelector } from "@/hooks/use-month-selector";
import { useModalStore } from "@/stores/modals/use-modal-store";
import { calcularResumoFinanceiro } from "@/utils/financeiro";
import { useResumoFinanceiro } from "../../hooks/queries/resumo-financeiro/use-resumo-financeiro";
import { useTransacoes } from "../../hooks/queries/transacoes/use-transacoes";
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
    useTransacoes({
      page: 0,
      size: 5,
      dataInicio,
      dataFim,
    });

  // Buscar transações do mês para cálculos precisos
  const { data: transacoesMes, isLoading: loadingMes } = useTransacoes({
    page: 0,
    size: 1000, // Buscar todas as transações do mês
    dataInicio,
    dataFim,
  });

  // Debug: Log das datas sendo usadas na consulta
  console.log("📅 Datas da consulta:", {
    dataInicio,
    dataFim,
    formattedMonth,
  });

  // Buscar resumo financeiro do mês selecionado - TESTANDO ENDPOINT CORRIGIDO
  const {
    data: resumoFinanceiro,
    isLoading: loadingResumo,
    error,
  } = useResumoFinanceiro({ dataInicio, dataFim, enabled: true });

  // Para debug, se der erro novamente, descomente abaixo:
  // const resumoFinanceiro = null;
  // const loadingResumo = false;
  // const error = null;

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

  // Log detalhado das transações para debug
  console.log("🔍 Transações brutas do mês:", {
    periodo: `${dataInicio} a ${dataFim}`,
    totalTransacoesFiltradas: todasTransacoesMes.length,
    primeiraTransacao: todasTransacoesMes[0],
    segundaTransacao: todasTransacoesMes[1],
    tiposUnicos: [...new Set(todasTransacoesMes.map((t) => t.tipo))],
    valoresUnicos: todasTransacoesMes
      .map((t) => ({ valor: t.valor, tipo: typeof t.valor }))
      .slice(0, 5),
    todasAsDatas: todasTransacoesMes.map((t) => t.dataTransacao).slice(0, 10),
  });

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
  const resumoFinal = resumoData || {
    saldo: 0,
    receitas: 0,
    despesas: 0,
    economias: 0,
    totalTransacoes: 0,
  };

  // Log para depuração
  console.log("📊 Dashboard - Dados do mês:", {
    periodo: `${dataInicio} a ${dataFim}`,
    totalTransacoes: todasTransacoesMes.length,
    resumoBackend: resumoFinanceiro,
    resumoCalculado: resumoData,
    resumoFinal: resumoFinal,
    loadingStatus: {
      loadingRecentes,
      loadingMes,
      loadingResumo,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        formattedMonth={formattedMonth}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onCurrentMonth={goToCurrentMonth}
        isCurrentMonth={isCurrentMonth}
        isLoadingMonth={loadingMes || loadingResumo}
      />

      {/* Cards de Resumo */}
      <SummaryCards data={resumoFinal} isLoading={isLoading} />

      {/* Gráfico de Tendência e Transações Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico Placeholder */}
        <TrendChart />

        {/* Transações Recentes */}
        <RecentTransactions
          transacoes={transacoesRecentesList}
          isLoading={loadingRecentes}
        />
      </div>

      {/* Modal de Nova Transação */}
      <TransacaoModal
        open={createTransacaoOpen}
        onClose={() => setCreateTransacaoOpen(false)}
      />
    </div>
  );
}
