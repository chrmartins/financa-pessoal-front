import type { PeriodMetrics } from "@/hooks/queries/transacoes/use-period-metrics";
import { ArrowDown, ArrowUp, DollarSign, TrendingUp } from "lucide-react";

interface SummaryCardsProps {
  data: PeriodMetrics | undefined;
  isLoading: boolean;
}

export function SummaryCards({ data, isLoading }: SummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercentual = (value: number) => {
    const signal = value >= 0 ? "+" : "";
    return `${signal}${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
            <div className="w-40 h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: "receitas",
      title: "Total de Receitas",
      value: data?.totalReceitas || 0,
      percentual: data?.crescimentoReceitas || 0,
      icon: ArrowUp,
      bgColor: "bg-green-500/10",
      color: "text-green-400",
      isPositive: (data?.crescimentoReceitas || 0) >= 0,
    },
    {
      id: "despesas",
      title: "Total de Despesas",
      value: data?.totalDespesas || 0,
      percentual: data?.crescimentoDespesas || 0,
      icon: ArrowDown,
      bgColor: "bg-red-500/10",
      color: "text-red-400",
      isPositive: (data?.crescimentoDespesas || 0) < 0, // Para despesas, redução é positivo
      invertColor: true,
    },
    {
      id: "saldo",
      title: "Saldo do Período",
      value: data?.saldo || 0,
      percentual: data?.crescimentoSaldo || 0,
      icon: DollarSign,
      bgColor: (data?.saldo || 0) >= 0 ? "bg-green-500/10" : "bg-red-500/10",
      color: (data?.saldo || 0) >= 0 ? "text-green-400" : "text-red-400",
      isPositive: (data?.crescimentoSaldo || 0) >= 0,
    },
    {
      id: "economia",
      title: "Economia Mensal",
      value: data?.economiaMedia || 0,
      percentual: data?.crescimentoEconomia || 0,
      icon: TrendingUp,
      bgColor: "bg-blue-500/10",
      color: "text-blue-400",
      isPositive: (data?.crescimentoEconomia || 0) >= 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const percentualColor = card.invertColor
          ? card.isPositive
            ? "text-green-400"
            : "text-red-400"
          : card.isPositive
          ? "text-green-400"
          : "text-red-400";

        return (
          <div
            key={card.id}
            className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div className={`text-sm font-medium ${percentualColor}`}>
                {formatPercentual(card.percentual)}
              </div>
            </div>

            <h3 className="text-gray-600 dark:text-slate-400 text-sm mb-1">
              {card.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(card.value)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
