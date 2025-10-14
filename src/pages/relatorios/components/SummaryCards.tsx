import { ArrowDown, ArrowUp, DollarSign, TrendingUp } from "lucide-react";

interface SummaryData {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  variacao: number;
}

interface SummaryCardsProps {
  data: SummaryData;
}

export function SummaryCards({ data }: SummaryCardsProps) {
  const cards = [
    {
      title: "Total de Receitas",
      value: data.totalReceitas,
      icon: ArrowUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      trend: "+12%",
      trendPositive: true,
    },
    {
      title: "Total de Despesas",
      value: data.totalDespesas,
      icon: ArrowDown,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      trend: "-8%",
      trendPositive: true,
    },
    {
      title: "Saldo do Período",
      value: data.saldo,
      icon: DollarSign,
      color: data.saldo >= 0 ? "text-green-400" : "text-red-400",
      bgColor: data.saldo >= 0 ? "bg-green-500/10" : "bg-red-500/10",
      trend: `${data.variacao > 0 ? "+" : ""}${data.variacao}%`,
      trendPositive: data.variacao > 0,
    },
    {
      title: "Economia Mensal",
      value: data.totalReceitas - data.totalDespesas,
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      trend: "+15%",
      trendPositive: true,
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div
                className={`text-sm font-medium ${
                  card.trendPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                {card.trend}
              </div>
            </div>

            <h3 className="text-slate-400 text-sm mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(card.value)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
