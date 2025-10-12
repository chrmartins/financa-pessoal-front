import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Usuario } from "@/types";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

interface DeleteUsuarioPermanentementeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: Usuario | null;
  onConfirm: (id: string) => void;
  isDeleting: boolean;
}

export function DeleteUsuarioPermanentementeModal({
  open,
  onOpenChange,
  usuario,
  onConfirm,
  isDeleting,
}: DeleteUsuarioPermanentementeModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const CONFIRM_WORD = "DELETAR";

  const handleConfirm = () => {
    if (usuario && confirmText === CONFIRM_WORD) {
      onConfirm(usuario.id);
      setConfirmText("");
    }
  };

  const handleCancel = () => {
    setConfirmText("");
    onOpenChange(false);
  };

  const isConfirmValid = confirmText === CONFIRM_WORD;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-6 w-6" />
            <AlertDialogTitle className="text-red-600 dark:text-red-400">
              ⚠️ Deletar Permanentemente
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <p className="font-semibold text-foreground">
                  Você está prestes a deletar permanentemente:
                </p>
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-medium text-foreground">{usuario?.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {usuario?.email}
                  </p>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-4 rounded-md space-y-2">
                <p className="font-semibold text-red-800 dark:text-red-200">
                  ⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL!
                </p>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                  <li>O usuário será removido permanentemente do sistema</li>
                  <li>
                    <strong>Todas as transações</strong> deste usuário serão
                    deletadas
                  </li>
                  <li>
                    <strong>Todas as categorias</strong> deste usuário serão
                    deletadas
                  </li>
                  <li>Não será possível recuperar estes dados</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-foreground">
                  Para confirmar, digite{" "}
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {CONFIRM_WORD}
                  </span>
                </Label>
                <Input
                  id="confirm"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  placeholder={`Digite "${CONFIRM_WORD}" para confirmar`}
                  className="font-mono"
                  disabled={isDeleting}
                  autoComplete="off"
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmValid || isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 dark:bg-red-700 dark:hover:bg-red-800"
          >
            {isDeleting ? "Deletando..." : "Deletar Permanentemente"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
