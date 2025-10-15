import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useTransacaoDelete } from "@/hooks/queries/transacoes/use-transacao-delete";
import type { TransacaoResponse } from "@/types";
import { formatCurrency } from "@/utils";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";

interface DeleteTransacaoModalProps {
  transacao: TransacaoResponse | null;
  open: boolean;
  onClose: () => void;
}

export function DeleteTransacaoModal({
  transacao,
  open,
  onClose,
}: DeleteTransacaoModalProps) {
  const deleteTransacao = useTransacaoDelete();
  const [escopoDelecao, setEscopoDelecao] = useState<
    "APENAS_ESTA" | "DESTA_DATA_EM_DIANTE"
  >("APENAS_ESTA");

  // Verifica se é transação FIXA
  const isTransacaoFixa =
    transacao?.recorrente && transacao?.tipoRecorrencia === "FIXA";

  const handleDelete = async () => {
    if (!transacao) return;

    // Prevenção adicional: não deletar se for preview (id null)
    if (!transacao.id) {
      console.error("❌ Tentativa de deletar transação sem ID (preview)");
      onClose();
      return;
    }

    try {
      // TODO: Backend precisa implementar escopos de deleção
      // Por enquanto, sempre deleta apenas a transação específica
      await deleteTransacao.mutateAsync(transacao.id);
      onClose();
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
    }
  };

  if (!transacao) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-gray-900 dark:text-gray-100">
                Excluir Transação
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Descrição:
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {transacao.descricao}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Valor:
              </span>
              <span
                className={`font-bold ${
                  transacao.tipo === "RECEITA"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {transacao.tipo === "RECEITA" ? "+" : "-"}
                {formatCurrency(Math.abs(transacao.valor))}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Categoria:
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {transacao.categoria?.nome || "Sem categoria"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Data:
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(transacao.dataTransacao).toLocaleDateString("pt-BR")}
              </span>
            </div>

            {transacao.observacoes && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-sm text-gray-600 dark:text-gray-400 block">
                  Observações:
                </span>
                <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                  {transacao.observacoes}
                </p>
              </div>
            )}
          </div>

          {/* ✅ Opções de escopo para transações FIXA */}
          {isTransacaoFixa && (
            <div className="mt-4 space-y-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <Label className="font-semibold text-amber-900 dark:text-amber-100">
                  ⚠️ Transação Recorrente FIXA
                </Label>
              </div>

              <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                Escolha o que deseja excluir:
              </p>

              {/* Opção 1: Apenas esta */}
              <div
                onClick={() => setEscopoDelecao("APENAS_ESTA")}
                className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                  escopoDelecao === "APENAS_ESTA"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    checked={escopoDelecao === "APENAS_ESTA"}
                    onChange={() => setEscopoDelecao("APENAS_ESTA")}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      📅 Apenas esta ocorrência
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Excluir apenas a transação de{" "}
                      {new Date(transacao.dataTransacao).toLocaleDateString(
                        "pt-BR"
                      )}
                      . As futuras continuarão aparecendo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Opção 2: Desta data em diante */}
              <div
                onClick={() => setEscopoDelecao("DESTA_DATA_EM_DIANTE")}
                className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                  escopoDelecao === "DESTA_DATA_EM_DIANTE"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    checked={escopoDelecao === "DESTA_DATA_EM_DIANTE"}
                    onChange={() => setEscopoDelecao("DESTA_DATA_EM_DIANTE")}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      🚫 Cancelar série a partir desta data
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Excluir esta transação e todas as futuras. As anteriores
                      serão mantidas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isTransacaoFixa && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Tem certeza de que deseja excluir esta transação? Esta ação é
              permanente e não pode ser desfeita.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteTransacao.isPending}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteTransacao.isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleteTransacao.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isTransacaoFixa
              ? escopoDelecao === "APENAS_ESTA"
                ? "Excluir Apenas Esta"
                : "Cancelar Série"
              : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
