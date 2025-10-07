import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { formatCurrency } from "@/utils";
import { Calendar, DollarSign, TrendingDown, TrendingUp } from "lucide-react";

interface SummaryData {
  saldo: number;
  receitas: number;
  despesas: number;
  economias: number;
  saldoComparacao?: number;
  receitasComparacao?: number;
  despesasComparacao?: number;
  economiasComparacao?: number;
}

interface SummaryCardsProps {
  data?: SummaryData;
  isLoading?: boolean;
}

function formatPercentage(value?: number): string {
  if (value === undefined || value === null) return "";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}% desde o mês passado`;
}

export function SummaryCards({ data, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((index) => (
          <Card
            key={index}
            className="card-gradient dark:bg-gray-800/95 dark:border-gray-700/50 animate-pulse"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24 dark:bg-gray-700"></div>
              <div className="h-4 w-4 bg-gray-200 rounded dark:bg-gray-700"></div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <Spinner size="md" />
              </div>
              <div className="h-3 bg-gray-200 rounded w-16 mt-2 dark:bg-gray-700"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-gradient dark:bg-gray-800/95 dark:border-gray-700/50">
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Nenhum dado disponível</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determinar cor do saldo baseado se é positivo ou negativo
  const saldoColor =
    data.saldo >= 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400";

  const saldoIconColor =
    data.saldo >= 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="card-gradient dark:bg-gray-800/95 dark:border-gray-700/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Saldo do Mês
          </CardTitle>
          <DollarSign className={`h-4 w-4 ${saldoIconColor}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${saldoColor}`}>
            {formatCurrency(data.saldo)}
          </div>
          {data.saldoComparacao !== undefined && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {formatPercentage(data.saldoComparacao)}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="card-gradient dark:bg-gray-800/95 dark:border-gray-700/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Receitas do Mês
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(data.receitas)}
          </div>
          {data.receitasComparacao !== undefined && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {formatPercentage(data.receitasComparacao)}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="card-gradient dark:bg-gray-800/95 dark:border-gray-700/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Despesas do Mês
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(data.despesas)}
          </div>
          {data.despesasComparacao !== undefined && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {formatPercentage(data.despesasComparacao)}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="card-gradient dark:bg-gray-800/95 dark:border-gray-700/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Economia
          </CardTitle>
          <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(data.economias)}
          </div>
          {data.economiasComparacao !== undefined && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {formatPercentage(data.economiasComparacao)}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
