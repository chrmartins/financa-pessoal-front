import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
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
import { useTrendData } from "../../../hooks/queries/transacoes/use-trend-data";

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
  // Buscar dados reais dos últimos 6 meses
  const { data: trendData, isLoading, error } = useTrendData();

  if (error) {
    return (
      <Card className="card-gradient dark:bg-gray-800/95 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-gray-100">
            <TrendingUp className="h-5 w-5" />
            Tendência Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center py-8">
            Erro ao carregar dados de tendência
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-gradient dark:bg-gray-800/95 dark:border-gray-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-gray-100">
          <TrendingUp className="h-5 w-5" />
          Tendência Financeira (6 meses)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 w-full flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
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
                  domain={[0, "dataMax + 2000"]} // Margem maior para visualização
                  allowDataOverflow={false}
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
                  strokeWidth={3}
                  dot={{ fill: "#22c55e", strokeWidth: 2, r: 6 }}
                  name="Receitas"
                  activeDot={{ r: 8 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="despesas"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
                  name="Despesas"
                  activeDot={{ r: 8 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                  name="Saldo"
                  activeDot={{ r: 8 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
