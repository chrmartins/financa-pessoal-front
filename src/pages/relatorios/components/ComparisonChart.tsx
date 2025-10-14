import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ComparisonData {
  category: string;
  mesAtual: number;
  mesAnterior: number;
}

interface ComparisonChartProps {
  data: ComparisonData[];
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">
        Comparação: Mês Atual vs Mês Anterior
      </h3>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="category"
            stroke="#94a3b8"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: "12px" }}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Bar
            dataKey="mesAnterior"
            fill="#64748b"
            name="Mês Anterior"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="mesAtual"
            fill="#8b5cf6"
            name="Mês Atual"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
