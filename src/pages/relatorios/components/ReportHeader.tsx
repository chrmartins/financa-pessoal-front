import type { PeriodoType } from "@/hooks/queries/transacoes/use-period-metrics";
import { Calendar } from "lucide-react";
import type { ReactNode } from "react";

interface ReportHeaderProps {
  selectedPeriod: PeriodoType;
  onPeriodChange: (period: PeriodoType) => void;
  onOpenPeriodDialog: () => void;
  customPeriodLabel?: string; // Label personalizado quando período custom está ativo
  exportButton?: ReactNode; // Botão de exportação passado como prop
}

export function ReportHeader({
  selectedPeriod,
  onPeriodChange,
  onOpenPeriodDialog,
  customPeriodLabel,
  exportButton,
}: ReportHeaderProps) {
  const periods = [
    { value: "month" as PeriodoType, label: "Este Mês" },
    { value: "quarter" as PeriodoType, label: "Trimestre" },
    { value: "year" as PeriodoType, label: "Este Ano" },
  ];

  const handlePeriodChange = (period: PeriodoType) => {
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
            <button
              onClick={onOpenPeriodDialog}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                selectedPeriod === "custom"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white"
              }`}
              title={customPeriodLabel || "Selecionar período personalizado"}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">
                {selectedPeriod === "custom" && customPeriodLabel
                  ? customPeriodLabel
                  : "Período"}
              </span>
            </button>

            {exportButton}
          </div>
        </div>
      </div>
    </div>
  );
}
