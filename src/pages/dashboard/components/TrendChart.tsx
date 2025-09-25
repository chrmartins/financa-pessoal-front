import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Dados simulados para o gráfico de tendência mensal
const monthlyData = [
  {
    mes: "Jan",
    receitas: 4500,
    despesas: 3200,
    saldo: 1300,
  },
  {
    mes: "Fev",
    receitas: 5200,
    despesas: 3800,
    saldo: 1400,
  },
  {
    mes: "Mar",
    receitas: 4800,
    despesas: 3500,
    saldo: 1300,
  },
  {
    mes: "Abr",
    receitas: 5500,
    despesas: 4100,
    saldo: 1400,
  },
  {
    mes: "Mai",
    receitas: 6000,
    despesas: 4200,
    saldo: 1800,
  },
  {
    mes: "Jun",
    receitas: 5800,
    despesas: 3900,
    saldo: 1900,
  },
];

// Componente customizado para tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3">
        <p className="text-gray-900 dark:text-gray-100 font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: R$ ${entry.value.toLocaleString("pt-BR")}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function TrendChart() {
  return (
    <Card className="card-gradient dark:bg-gray-800/95 dark:border-gray-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-gray-100">
          <TrendingUp className="h-5 w-5" />
          Tendência Mensal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-600"
              />
              <XAxis
                dataKey="mes"
                className="text-gray-600 dark:text-gray-400 text-xs"
                tick={{ fill: "currentColor" }}
              />
              <YAxis
                className="text-gray-600 dark:text-gray-400 text-xs"
                tick={{ fill: "currentColor" }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ color: "currentColor" }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="receitas"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                name="Receitas"
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="despesas"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                name="Despesas"
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="saldo"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                name="Saldo"
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
