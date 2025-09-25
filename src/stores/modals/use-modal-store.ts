import { create } from "zustand";
import { devtools } from "zustand/middleware";

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
