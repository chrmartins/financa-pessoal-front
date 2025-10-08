import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCategoriaDelete } from "@/hooks/queries/categorias/use-categoria-delete";
import type { CategoriaResponse } from "@/types";
import { BadgeCheck, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteCategoriaModalProps {
  categoria: CategoriaResponse | null;
  open: boolean;
  onClose: () => void;
}

export function DeleteCategoriaModal({
  categoria,
  open,
  onClose,
}: DeleteCategoriaModalProps) {
  const deleteCategoria = useCategoriaDelete();

  const handleDelete = async () => {
    if (!categoria) return;

    try {
      await deleteCategoria.mutateAsync(categoria.id);
      toast.success("Categoria excluída com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao excluir categoria", error);
      toast.error("Não foi possível excluir a categoria.");
    }
  };

  if (!categoria) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10 text-destructive">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Excluir categoria</DialogTitle>
              <DialogDescription>
                Tem certeza de que deseja excluir esta categoria? Esta ação não
                poderá ser desfeita.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 rounded-lg border bg-muted/30 p-4 text-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="text-sm">Nome</span>
            <span className="font-medium text-foreground">
              {categoria.nome}
            </span>
          </div>
          {categoria.descricao && (
            <div className="flex flex-col gap-1">
              <span className="text-sm">Descrição</span>
              <span className="text-sm text-foreground/80">
                {categoria.descricao}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm">Tipo</span>
            <span className="font-medium uppercase text-foreground">
              {categoria.tipo === "RECEITA" ? "Receita" : "Despesa"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Status</span>
            <span className="flex items-center gap-1 text-sm font-medium text-foreground">
              <BadgeCheck
                className={`h-4 w-4 ${
                  categoria.ativa ? "text-green-500" : "text-muted-foreground"
                }`}
              />
              {categoria.ativa ? "Ativa" : "Inativa"}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={deleteCategoria.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteCategoria.isPending}
          >
            {deleteCategoria.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Excluir categoria
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
