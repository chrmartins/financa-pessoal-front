import { useState } from "react";

/**
 * Hook para gerenciar a seleção de mês/ano no dashboard
 */
export function useMonthSelector() {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-11

  // Calcular datas de início e fim do mês selecionado
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
  const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

  const dataInicio = firstDayOfMonth.toISOString().split("T")[0];
  const dataFim = lastDayOfMonth.toISOString().split("T")[0];

  // Formatar mês para exibição
  const monthName = new Date(selectedYear, selectedMonth, 1).toLocaleDateString(
    "pt-BR",
    {
      month: "long",
      year: "numeric",
    }
  );
  const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // Navegação entre meses
  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const goToCurrentMonth = () => {
    const today = new Date();
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth());
  };

  // Verificar se é o mês atual
  const isCurrentMonth =
    selectedYear === now.getFullYear() && selectedMonth === now.getMonth();

  return {
    selectedYear,
    selectedMonth,
    dataInicio,
    dataFim,
    formattedMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    isCurrentMonth,
  };
}
