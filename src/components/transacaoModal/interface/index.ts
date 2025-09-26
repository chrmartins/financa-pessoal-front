import type { TransacaoResponse } from "@/types";

export interface TransacaoModalProps {
  open: boolean;
  onClose: () => void;
  transacao?: TransacaoResponse | null;
}