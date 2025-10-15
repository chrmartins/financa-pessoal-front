import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTransacaoDelete } from "@/hooks/queries/transacoes/use-transacao-delete";
import type { TransacaoResponse } from "@/types";
import { formatCurrency } from "@/utils";
import { AlertTriangle, Loader2 } from "lucide-react";

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

  const handleDelete = async () => {
    if (!transacao) return;

    // Prevenção adicional: não deletar se for preview (id null)
    if (!transacao.id) {
      console.error("❌ Tentativa de deletar transação sem ID (preview)");
      onClose();
      return;
    }

    try {
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

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Tem certeza de que deseja excluir esta transação? Esta ação é
            permanente e não pode ser desfeita.
          </p>
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
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
