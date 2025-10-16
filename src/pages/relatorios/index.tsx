import { useCategoryExpenses } from "@/hooks/queries/transacoes/use-category-expenses";
import { useComparisonData } from "@/hooks/queries/transacoes/use-comparison-data";
import { useMonthlyTrend } from "@/hooks/queries/transacoes/use-monthly-trend";
import {
  usePeriodMetrics,
  type PeriodoType,
} from "@/hooks/queries/transacoes/use-period-metrics";
import { useTopExpenses } from "@/hooks/queries/transacoes/use-top-expenses";
import { useState } from "react";
import {
  ComparisonChart,
  ExpensesByCategory,
  ExportButton,
  MonthlyTrend,
  PeriodDialog,
  ReportHeader,
  SummaryCards,
  TopExpenses,
} from "./components";

export function RelatoriosPage() {
  // Estado para controlar o período selecionado
  const [periodoSelecionado, setPeriodoSelecionado] =
    useState<PeriodoType>("quarter");

  // Estados para período personalizado
  const [periodDialogOpen, setPeriodDialogOpen] = useState(false);
  const [customDataInicio, setCustomDataInicio] = useState<Date | undefined>();
  const [customDataFim, setCustomDataFim] = useState<Date | undefined>();
  const [customPeriodLabel, setCustomPeriodLabel] = useState<string>("");

  const hoje = new Date();
  const mesAtual = hoje.getMonth(); // 0-11
  const anoAtual = hoje.getFullYear();

  // Buscar métricas do período selecionado (NOVO - DADOS REAIS)
  const { data: metricas, isLoading: isLoadingMetricas } = usePeriodMetrics({
    periodo: periodoSelecionado,
    dataInicio: customDataInicio,
    dataFim: customDataFim,
  });

  // Buscar dados reais de tendência (últimos 12 meses)
  const { data: trendData, isLoading: isLoadingTrend } = useMonthlyTrend({
    meses: 12,
  });

  // Buscar dados reais de comparação
  const { data: comparisonData, isLoading: isLoadingComparison } =
    useComparisonData({
      mes: mesAtual,
      ano: anoAtual,
    });

  // Buscar despesas por categoria do período selecionado
  const { data: categoryData, isLoading: isLoadingCategory } =
    useCategoryExpenses({
      periodo: periodoSelecionado,
      dataInicio: customDataInicio,
      dataFim: customDataFim,
    });

  // Buscar maiores despesas do período selecionado
  const { data: topExpensesData, isLoading: isLoadingTopExpenses } =
    useTopExpenses({
      periodo: periodoSelecionado,
      dataInicio: customDataInicio,
      dataFim: customDataFim,
      limit: 10,
    });

  const handlePeriodChange = (newPeriod: PeriodoType) => {
    setPeriodoSelecionado(newPeriod);
    // Limpar período personalizado se mudar para outro tipo
    if (newPeriod !== "custom") {
      setCustomDataInicio(undefined);
      setCustomDataFim(undefined);
      setCustomPeriodLabel("");
    }
  };

  const handleApplyCustomPeriod = (dataInicio: Date, dataFim: Date) => {
    setCustomDataInicio(dataInicio);
    setCustomDataFim(dataFim);
    setPeriodoSelecionado("custom");

    // Formatar label
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      });
    };

    setCustomPeriodLabel(`${formatDate(dataInicio)} - ${formatDate(dataFim)}`);
  };

  // Preparar label do período para exportação
  const getPeriodoLabel = () => {
    if (periodoSelecionado === "custom" && customPeriodLabel) {
      return customPeriodLabel;
    }

    const labels = {
      month: "Este Mês",
      quarter: "Trimestre",
      year: "Este Ano",
      custom: "Período Personalizado",
    };

    return labels[periodoSelecionado];
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header com filtros */}
        <ReportHeader
          selectedPeriod={periodoSelecionado}
          onPeriodChange={handlePeriodChange}
          onOpenPeriodDialog={() => setPeriodDialogOpen(true)}
          customPeriodLabel={customPeriodLabel}
          exportButton={
            <ExportButton
              periodo={getPeriodoLabel()}
              metricas={metricas}
              categorias={categoryData}
              topDespesas={topExpensesData}
              disabled={
                isLoadingMetricas || isLoadingCategory || isLoadingTopExpenses
              }
            />
          }
        />

        {/* Cards de resumo - DADOS REAIS */}
        <SummaryCards data={metricas} isLoading={isLoadingMetricas} />

        {/* Gráfico de tendência - DADOS REAIS */}
        {isLoadingTrend ? (
          <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex items-center justify-center h-[450px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">
                Carregando tendência financeira...
              </p>
            </div>
          </div>
        ) : trendData && trendData.length > 0 ? (
          <MonthlyTrend data={trendData} />
        ) : (
          <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex items-center justify-center h-[450px]">
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                📈 Sem dados de tendência
              </p>
              <p className="text-sm text-slate-500">
                Adicione transações para visualizar a tendência financeira
              </p>
            </div>
          </div>
        )}

        {/* Grid com 2 colunas */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Despesas por categoria (Pizza) - DADOS REAIS */}
          <ExpensesByCategory
            data={categoryData}
            isLoading={isLoadingCategory}
          />

          {/* Comparação mês a mês (Barras) - DADOS REAIS */}
          {isLoadingComparison ? (
            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex items-center justify-center h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">
                  Carregando comparação...
                </p>
              </div>
            </div>
          ) : comparisonData && comparisonData.length > 0 ? (
            <ComparisonChart data={comparisonData} />
          ) : (
            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex items-center justify-center h-[400px]">
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  📊 Sem dados para comparação
                </p>
                <p className="text-sm text-slate-500">
                  Adicione transações para ver a comparação entre meses
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Top despesas - DADOS REAIS */}
        <TopExpenses data={topExpensesData} isLoading={isLoadingTopExpenses} />

        {/* Footer com informações */}
        <div className="bg-slate-100 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <p>
              📊 Relatório gerado em{" "}
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>💡 Dica: Exporte seus relatórios para análise offline</p>
          </div>
        </div>
      </div>

      {/* Diálogo de seleção de período personalizado */}
      <PeriodDialog
        open={periodDialogOpen}
        onClose={() => setPeriodDialogOpen(false)}
        onApply={handleApplyCustomPeriod}
      />
    </div>
  );
}
