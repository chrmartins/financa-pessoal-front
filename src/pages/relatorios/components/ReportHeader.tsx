import { Calendar, Download } from "lucide-react";
import { useState } from "react";

type PeriodType = "month" | "quarter" | "year" | "custom";

interface ReportHeaderProps {
  onPeriodChange: (period: PeriodType) => void;
  onExport: () => void;
}

export function ReportHeader({ onPeriodChange, onExport }: ReportHeaderProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("month");

  const periods = [
    { value: "month" as PeriodType, label: "Este Mês" },
    { value: "quarter" as PeriodType, label: "Trimestre" },
    { value: "year" as PeriodType, label: "Este Ano" },
    { value: "custom" as PeriodType, label: "Personalizado" },
  ];

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
    onPeriodChange(period);
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Título */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Relatórios Financeiros
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Análise completa das suas finanças
          </p>
        </div>

        {/* Filtros e Ações */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Seletor de Período */}
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900/50 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => handlePeriodChange(period.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  selectedPeriod === period.value
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg transition">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Período</span>
            </button>

            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
