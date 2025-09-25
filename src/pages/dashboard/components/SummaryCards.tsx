import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils";
import { Calendar, DollarSign, TrendingDown, TrendingUp } from "lucide-react";

interface SummaryData {
  saldo: number;
  receitas: number;
  despesas: number;
  economias: number;
}

interface SummaryCardsProps {
  data: SummaryData;
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
          <p className="text-xs text-gray-600 dark:text-gray-400">
            +12.5% desde o mês passado
          </p>
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
          <p className="text-xs text-gray-600 dark:text-gray-400">
            +8.2% desde o mês passado
          </p>
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
          <p className="text-xs text-gray-600 dark:text-gray-400">
            -3.1% desde o mês passado
          </p>
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
          <p className="text-xs text-gray-600 dark:text-gray-400">
            +15.3% desde o mês passado
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
