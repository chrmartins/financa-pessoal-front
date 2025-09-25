import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Store para UI/Theme
interface UIState {
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        theme: "system",
        sidebarOpen: false,
        isMobile: false,
        toggleSidebar: () =>
          set(
            (state) => ({ sidebarOpen: !state.sidebarOpen }),
            false,
            "toggleSidebar"
          ),
        setTheme: (theme) => set({ theme }, false, "setTheme"),
        setIsMobile: (isMobile) => set({ isMobile }, false, "setIsMobile"),
      }),
      {
        name: "ui-store",
        partialize: (state) => ({ theme: state.theme }),
      }
    ),
    { name: "ui-store" }
  )
);

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

// Store para estado do usuário (se necessário futuramente)
interface UserState {
  user: {
    id: number;
    nome: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
  setUser: (user: UserState["user"]) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        setUser: (user) =>
          set({ user, isAuthenticated: !!user }, false, "setUser"),
        logout: () =>
          set({ user: null, isAuthenticated: false }, false, "logout"),
      }),
      {
        name: "user-store",
      }
    ),
    { name: "user-store" }
  )
);

// Store para modais e estados de UI específicos
interface ModalState {
  createCategoriaOpen: boolean;
  editCategoriaOpen: boolean;
  createTransacaoOpen: boolean;
  editTransacaoOpen: boolean;
  deleteConfirmOpen: boolean;
  selectedItemId: number | null;
  selectedItemType: "categoria" | "transacao" | null;
  setCreateCategoriaOpen: (open: boolean) => void;
  setEditCategoriaOpen: (open: boolean, id?: number) => void;
  setCreateTransacaoOpen: (open: boolean) => void;
  setEditTransacaoOpen: (open: boolean, id?: number) => void;
  setDeleteConfirmOpen: (
    open: boolean,
    type?: "categoria" | "transacao",
    id?: number
  ) => void;
  closeAllModals: () => void;
}

export const useModalStore = create<ModalState>()(
  devtools(
    (set) => ({
      createCategoriaOpen: false,
      editCategoriaOpen: false,
      createTransacaoOpen: false,
      editTransacaoOpen: false,
      deleteConfirmOpen: false,
      selectedItemId: null,
      selectedItemType: null,
      setCreateCategoriaOpen: (open) =>
        set({ createCategoriaOpen: open }, false, "setCreateCategoriaOpen"),
      setEditCategoriaOpen: (open, id) =>
        set(
          {
            editCategoriaOpen: open,
            selectedItemId: id || null,
            selectedItemType: "categoria",
          },
          false,
          "setEditCategoriaOpen"
        ),
      setCreateTransacaoOpen: (open) =>
        set({ createTransacaoOpen: open }, false, "setCreateTransacaoOpen"),
      setEditTransacaoOpen: (open, id) =>
        set(
          {
            editTransacaoOpen: open,
            selectedItemId: id || null,
            selectedItemType: "transacao",
          },
          false,
          "setEditTransacaoOpen"
        ),
      setDeleteConfirmOpen: (open, type, id) =>
        set(
          {
            deleteConfirmOpen: open,
            selectedItemType: type || null,
            selectedItemId: id || null,
          },
          false,
          "setDeleteConfirmOpen"
        ),
      closeAllModals: () =>
        set(
          {
            createCategoriaOpen: false,
            editCategoriaOpen: false,
            createTransacaoOpen: false,
            editTransacaoOpen: false,
            deleteConfirmOpen: false,
            selectedItemId: null,
            selectedItemType: null,
          },
          false,
          "closeAllModals"
        ),
    }),
    { name: "modal-store" }
  )
);
