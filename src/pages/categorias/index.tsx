import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCategoriasList } from "@/hooks/queries/categorias/use-categorias-list";
import type { CategoriaResponse } from "@/types";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { CategoriaFormModal } from "./components/CategoriaFormModal";
import { CategoriasTable } from "./components/CategoriasTable";
import { DeleteCategoriaModal } from "./components/DeleteCategoriaModal";

export function CategoriasPage() {
  const [selectedCategoria, setSelectedCategoria] =
    useState<CategoriaResponse | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading, isError } = useCategoriasList();

  const categorias = useMemo(() => data ?? [], [data]);

  const handleCreate = () => {
    setSelectedCategoria(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (categoria: CategoriaResponse) => {
    setSelectedCategoria(categoria);
    setIsFormModalOpen(true);
  };

  const handleDelete = (categoria: CategoriaResponse) => {
    setSelectedCategoria(categoria);
    setIsDeleteModalOpen(true);
  };

  const handleCloseFormModal = (_categoriaCriadaId?: string) => {
    setIsFormModalOpen(false);
    setSelectedCategoria(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCategoria(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Categorias
          </h1>
          <p className="text-sm text-muted-foreground">
            Organize suas receitas e despesas com categorias personalizadas.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova categoria
        </Button>
      </div>

      {isError ? (
        <Card className="border-destructive/30 bg-destructive/10 text-destructive">
          <CardContent className="py-6">
            <p>
              Não foi possível carregar as categorias. Tente novamente mais
              tarde.
            </p>
          </CardContent>
        </Card>
      ) : (
        <CategoriasTable
          categorias={categorias}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <CategoriaFormModal
        categoria={selectedCategoria}
        open={isFormModalOpen}
        onClose={handleCloseFormModal}
      />

      <DeleteCategoriaModal
        categoria={selectedCategoria}
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
      />
    </div>
  );
}
