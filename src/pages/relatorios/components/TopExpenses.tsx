import { ArrowDown, Calendar, Tag } from "lucide-react";

interface ExpenseItem {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  categoryColor: string;
}

interface TopExpensesProps {
  data: ExpenseItem[] | undefined;
  isLoading: boolean;
}

export function TopExpenses({ data, isLoading }: TopExpensesProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  // Estado de loading
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Maiores Despesas
          </h3>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-slate-400">
            <ArrowDown className="w-4 h-4 text-red-400" />
            <span className="text-sm">Top 10</span>
          </div>
        </div>

        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg animate-pulse"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Estado vazio
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Maiores Despesas
          </h3>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-slate-400">
            <ArrowDown className="w-4 h-4 text-red-400" />
            <span className="text-sm">Top 10</span>
          </div>
        </div>

        <div className="text-center py-12 text-gray-600 dark:text-slate-400">
          <ArrowDown className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="mb-2">Nenhuma despesa encontrada neste período</p>
          <p className="text-sm">
            Adicione transações de despesa para ver as maiores aqui
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          Maiores Despesas
        </h3>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-slate-400">
          <ArrowDown className="w-4 h-4 text-red-400" />
          <span className="text-xs sm:text-sm">Top 10</span>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((expense, index) => (
          <div
            key={expense.id}
            className="flex items-start sm:items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/80 transition gap-2 sm:gap-4"
          >
            {/* Esquerda: Ranking + Info */}
            <div className="flex items-start sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {/* Número do ranking */}
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-slate-200 dark:bg-slate-700 rounded-full text-gray-900 dark:text-white font-bold text-xs sm:text-sm flex-shrink-0">
                {index + 1}
              </div>

              {/* Informações */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base truncate">
                  {expense.description}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-slate-400 text-xs sm:text-sm">
                    <Tag className="w-3 h-3 flex-shrink-0" />
                    <span
                      className="truncate"
                      style={{ color: expense.categoryColor }}
                    >
                      {expense.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-slate-400 text-xs sm:text-sm">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span className="whitespace-nowrap">
                      {formatDate(expense.date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direita: Valor */}
            <div className="text-right flex-shrink-0">
              <p className="text-red-400 font-bold text-sm sm:text-lg whitespace-nowrap">
                {formatCurrency(expense.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
