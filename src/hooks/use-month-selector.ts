import { useMonthStore } from "@/stores/ui/use-month-store";
import { useMemo } from "react";

/**
 * Hook para gerenciar a seleção de mês/ano
 * Sincronizado globalmente entre Dashboard e Transações
 */
export function useMonthSelector() {
  const now = useMemo(() => new Date(), []); // Memoizar para evitar re-renders

  // Usar a store global ao invés de estado local
  const {
    selectedYear,
    selectedMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
  } = useMonthStore();

  // Calcular datas de início e fim do mês selecionado (memoizado)
  const { dataInicio, dataFim, formattedMonth } = useMemo(() => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

    const inicio = firstDayOfMonth.toISOString().split("T")[0];
    const fim = lastDayOfMonth.toISOString().split("T")[0];

    // Formatar mês para exibição
    const monthName = new Date(
      selectedYear,
      selectedMonth,
      1
    ).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    const formatted = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    return {
      dataInicio: inicio,
      dataFim: fim,
      formattedMonth: formatted,
    };
  }, [selectedYear, selectedMonth]);

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
