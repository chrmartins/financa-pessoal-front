import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Store para controle do modal de transação
interface ModalState {
  createTransacaoOpen: boolean;
  setCreateTransacaoOpen: (open: boolean) => void;
}

export const useModalStore = create<ModalState>()(
  devtools(
    (set) => ({
      createTransacaoOpen: false,
      setCreateTransacaoOpen: (open) =>
        set({ createTransacaoOpen: open }, false, "setCreateTransacaoOpen"),
    }),
    { name: "modal-store" }
  )
);
