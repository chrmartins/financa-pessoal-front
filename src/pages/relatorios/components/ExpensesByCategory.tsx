import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface ExpensesByCategoryProps {
  data: CategoryData[];
}

export function ExpensesByCategory({ data }: ExpensesByCategoryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
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

  return (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Despesas por Categoria
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }: any) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Lista de categorias */}
      <div className="mt-6 space-y-3">
        {data.map((category, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-gray-700 dark:text-slate-300">
                {category.name}
              </span>
            </div>
            <span className="text-gray-900 dark:text-white font-semibold">
              {formatCurrency(category.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
