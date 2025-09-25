import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  data: SummaryData;
}

function formatPercentage(value?: number): string {
  if (value === undefined || value === null) return "";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}% desde o mês passado`;
}

export function SummaryCards({ data }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="card-gradient dark:bg-gray-800/95 dark:border-gray-700/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Saldo Total
          </CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
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
            Receitas
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
            Despesas
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
