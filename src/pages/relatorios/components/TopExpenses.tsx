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
  data: ExpenseItem[];
}

export function TopExpenses({ data }: TopExpensesProps) {
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
        {data.map((expense, index) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/80 transition"
          >
            {/* Esquerda: Ranking + Info */}
            <div className="flex items-center space-x-4 flex-1">
              {/* Número do ranking */}
              <div className="flex items-center justify-center w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full text-gray-900 dark:text-white font-bold text-sm">
                {index + 1}
              </div>

              {/* Informações */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 dark:text-white font-medium truncate">
                  {expense.description}
                </p>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-slate-400 text-sm">
                    <Tag className="w-3 h-3" />
                    <span
                      className="truncate max-w-[120px]"
                      style={{ color: expense.categoryColor }}
                    >
                      {expense.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-slate-400 text-sm">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direita: Valor */}
            <div className="text-right ml-4">
              <p className="text-red-400 font-bold text-lg">
                {formatCurrency(expense.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12 text-gray-600 dark:text-slate-400">
          <ArrowDown className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nenhuma despesa encontrada neste período</p>
        </div>
      )}
    </div>
  );
}
