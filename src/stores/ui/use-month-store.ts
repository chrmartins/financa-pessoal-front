import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

/**
 * Store global para gerenciar o mês/ano selecionado
 * Sincroniza a seleção entre Dashboard e Transações
 */
interface MonthState {
  selectedYear: number;
  selectedMonth: number; // 0-11 (JavaScript Date format)
  setMonth: (year: number, month: number) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToCurrentMonth: () => void;
}

export const useMonthStore = create<MonthState>()(
  devtools(
    persist(
      (set) => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        return {
          selectedYear: currentYear,
          selectedMonth: currentMonth,

          setMonth: (year, month) =>
            set(
              { selectedYear: year, selectedMonth: month },
              false,
              "setMonth"
            ),

          goToPreviousMonth: () =>
            set(
              (state) => {
                if (state.selectedMonth === 0) {
                  return {
                    selectedMonth: 11,
                    selectedYear: state.selectedYear - 1,
                  };
                }
                return { selectedMonth: state.selectedMonth - 1 };
              },
              false,
              "goToPreviousMonth"
            ),

          goToNextMonth: () =>
            set(
              (state) => {
                if (state.selectedMonth === 11) {
                  return {
                    selectedMonth: 0,
                    selectedYear: state.selectedYear + 1,
                  };
                }
                return { selectedMonth: state.selectedMonth + 1 };
              },
              false,
              "goToNextMonth"
            ),

          goToCurrentMonth: () => {
            const today = new Date();
            set(
              {
                selectedYear: today.getFullYear(),
                selectedMonth: today.getMonth(),
              },
              false,
              "goToCurrentMonth"
            );
          },
        };
      },
      {
        name: "month-store",
      }
    ),
    { name: "month-store" }
  )
);
