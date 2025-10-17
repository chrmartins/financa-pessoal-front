import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryData {
  name: string;
  value: number;
  color: string;
  categoriaId?: string;
  percentage?: number;
  [key: string]: string | number | undefined;
}

interface ExpensesByCategoryProps {
  data: CategoryData[] | undefined;
  isLoading: boolean;
}

export function ExpensesByCategory({
  data,
  isLoading,
}: ExpensesByCategoryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; percent: number }>;
  }) => {
    if (active && payload && payload.length && data) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-900 dark:text-white font-semibold">
            {payload[0].name}
          </p>
          <p className="text-gray-700 dark:text-slate-300">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-gray-600 dark:text-slate-400 text-sm">
            {(
              (payload[0].value /
                data.reduce((sum, item) => sum + item.value, 0)) *
              100
            ).toFixed(1)}
            %
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Despesas por Categoria
        </h3>
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
        </div>
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between animate-pulse"
            >
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
              <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Despesas por Categoria
        </h3>
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              📊 Sem despesas neste período
            </p>
            <p className="text-sm text-slate-500">
              Adicione transações de despesa para ver a distribuição
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Despesas por Categoria
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Apenas transações de despesa
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            {formatCurrency(totalValue)}
          </p>
        </div>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            {/* Donut Chart com efeito 3D */}
            <defs>
              {data.map((entry, index) => (
                <radialGradient
                  key={`gradient-${index}`}
                  id={`gradient-${index}`}
                >
                  <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                  <stop
                    offset="100%"
                    stopColor={entry.color}
                    stopOpacity={0.8}
                  />
                </radialGradient>
              ))}
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={70}
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
              strokeWidth={3}
              stroke="rgba(15, 23, 42, 0.5)"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-${index})`}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  style={{
                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))",
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Valor total no centro do donut */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Distribuição
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.length}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            categorias
          </p>
        </div>
      </div>

      {/* Lista de categorias com visual moderno */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.map((category) => {
          const percentage = ((category.value / totalValue) * 100).toFixed(1);
          return (
            <div
              key={category.categoriaId || category.name}
              className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full shadow-lg"
                    style={{
                      backgroundColor: category.color,
                      boxShadow: `0 0 10px ${category.color}40`,
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                    {category.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                  {percentage}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  {formatCurrency(category.value)}
                </span>
              </div>

              {/* Barra de progresso */}
              <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: category.color,
                    boxShadow: `0 0 8px ${category.color}60`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Estatísticas adicionais */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Maior Gasto
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {formatCurrency(Math.max(...data.map((d) => d.value)))}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {
                data.find(
                  (d) => d.value === Math.max(...data.map((item) => item.value))
                )?.name
              }
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Média por Categoria
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalValue / data.length)}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {data.length} {data.length === 1 ? "categoria" : "categorias"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Menor Gasto
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {formatCurrency(Math.min(...data.map((d) => d.value)))}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {
                data.find(
                  (d) => d.value === Math.min(...data.map((item) => item.value))
                )?.name
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
