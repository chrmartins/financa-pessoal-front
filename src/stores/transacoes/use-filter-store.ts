import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Store para Filtros de Transação
interface FilterState {
  filters: {
    dataInicio?: string;
    dataFim?: string;
    categoriaId?: number;
    tipo?: "RECEITA" | "DESPESA";
    page: number;
    size: number;
  };
  setFilter: <K extends keyof FilterState["filters"]>(
    key: K,
    value: FilterState["filters"][K]
  ) => void;
  clearFilters: () => void;
  setDateRange: (dataInicio?: string, dataFim?: string) => void;
}

export const useFilterStore = create<FilterState>()(
  devtools(
    persist(
      (set) => ({
        filters: {
          page: 0,
          size: 20,
        },
        setFilter: (key, value) =>
          set(
            (state) => ({
              filters: { ...state.filters, [key]: value, page: 0 }, // Reset page when filter changes
            }),
            false,
            `setFilter:${key}`
          ),
        clearFilters: () =>
          set(
            {
              filters: {
                page: 0,
                size: 20,
              },
            },
            false,
            "clearFilters"
          ),
        setDateRange: (dataInicio, dataFim) =>
          set(
            (state) => ({
              filters: {
                ...state.filters,
                dataInicio,
                dataFim,
                page: 0,
              },
            }),
            false,
            "setDateRange"
          ),
      }),
      {
        name: "filter-store",
      }
    ),
    { name: "filter-store" }
  )
);
