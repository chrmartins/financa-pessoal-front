import { useComparisonData } from "@/hooks/queries/transacoes/use-comparison-data";
import {
  ComparisonChart,
  ExpensesByCategory,
  MonthlyTrend,
  ReportHeader,
  SummaryCards,
  TopExpenses,
} from "./components";

// Dados fictícios para demonstração
const mockSummaryData = {
  totalReceitas: 5000,
  totalDespesas: 3500,
  saldo: 1500,
  variacao: 12.5,
};

const mockCategoryData = [
  { name: "Alimentação", value: 1200, color: "#ef4444" },
  { name: "Transporte", value: 800, color: "#f59e0b" },
  { name: "Moradia", value: 600, color: "#8b5cf6" },
  { name: "Lazer", value: 400, color: "#3b82f6" },
  { name: "Saúde", value: 300, color: "#10b981" },
  { name: "Educação", value: 200, color: "#06b6d4" },
];

const mockMonthlyData = [
  { month: "Mai", receitas: 4500, despesas: 3200, saldo: 1300 },
  { month: "Jun", receitas: 4800, despesas: 3400, saldo: 1400 },
  { month: "Jul", receitas: 5200, despesas: 3600, saldo: 1600 },
  { month: "Ago", receitas: 4900, despesas: 3300, saldo: 1600 },
  { month: "Set", receitas: 5100, despesas: 3500, saldo: 1600 },
  { month: "Out", receitas: 5000, despesas: 3500, saldo: 1500 },
];

const mockTopExpenses = [
  {
    id: "1",
    description: "Aluguel Apartamento",
    category: "Moradia",
    amount: 1500,
    date: "2025-10-05",
    categoryColor: "#8b5cf6",
  },
  {
    id: "2",
    description: "Supermercado - Compra Mensal",
    category: "Alimentação",
    amount: 650,
    date: "2025-10-10",
    categoryColor: "#ef4444",
  },
  {
    id: "3",
    description: "Gasolina",
    category: "Transporte",
    amount: 400,
    date: "2025-10-08",
    categoryColor: "#f59e0b",
  },
  {
    id: "4",
    description: "Academia - Mensalidade",
    category: "Saúde",
    amount: 250,
    date: "2025-10-01",
    categoryColor: "#10b981",
  },
  {
    id: "5",
    description: "Restaurante - Jantar",
    category: "Alimentação",
    amount: 180,
    date: "2025-10-12",
    categoryColor: "#ef4444",
  },
  {
    id: "6",
    description: "Cinema",
    category: "Lazer",
    amount: 120,
    date: "2025-10-15",
    categoryColor: "#3b82f6",
  },
  {
    id: "7",
    description: "Uber/99",
    category: "Transporte",
    amount: 95,
    date: "2025-10-13",
    categoryColor: "#f59e0b",
  },
  {
    id: "8",
    description: "Farmácia",
    category: "Saúde",
    amount: 85,
    date: "2025-10-11",
    categoryColor: "#10b981",
  },
  {
    id: "9",
    description: "Livros",
    category: "Educação",
    amount: 75,
    date: "2025-10-09",
    categoryColor: "#06b6d4",
  },
  {
    id: "10",
    description: "Streaming (Netflix)",
    category: "Lazer",
    amount: 45,
    date: "2025-10-01",
    categoryColor: "#3b82f6",
  },
];

export function RelatoriosPage() {
  // Estado para controlar o mês/ano sendo visualizado
  const hoje = new Date();
  const mesAtual = hoje.getMonth(); // 0-11
  const anoAtual = hoje.getFullYear();

  // Buscar dados reais de comparação
  const { data: comparisonData, isLoading: isLoadingComparison } =
    useComparisonData({
      mes: mesAtual,
      ano: anoAtual,
    });

  const handlePeriodChange = (
    newPeriod: "month" | "quarter" | "year" | "custom"
  ) => {
    // Aqui você faria a chamada para buscar novos dados com base no período
    console.log("Período alterado para:", newPeriod);
  };

  const handleExport = () => {
    // Implementar lógica de exportação (PDF, Excel, CSV)
    console.log("Exportando relatório...");
    alert("Funcionalidade de exportação em desenvolvimento!");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header com filtros */}
        <ReportHeader
          onPeriodChange={handlePeriodChange}
          onExport={handleExport}
        />

        {/* Cards de resumo */}
        <SummaryCards data={mockSummaryData} />

        {/* Gráfico de tendência */}
        <MonthlyTrend data={mockMonthlyData} />

        {/* Grid com 2 colunas */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Despesas por categoria (Pizza) */}
          <ExpensesByCategory data={mockCategoryData} />

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

        {/* Top despesas */}
        <TopExpenses data={mockTopExpenses} />

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
    </div>
  );
}
