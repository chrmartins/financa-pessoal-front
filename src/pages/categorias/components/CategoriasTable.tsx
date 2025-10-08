import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoriaResponse } from "@/types";
import { formatDate } from "@/utils";
import { Pencil, Trash2 } from "lucide-react";

interface CategoriasTableProps {
  categorias: CategoriaResponse[];
  isLoading?: boolean;
  onEdit: (categoria: CategoriaResponse) => void;
  onDelete: (categoria: CategoriaResponse) => void;
}

export function CategoriasTable({
  categorias,
  isLoading = false,
  onEdit,
  onDelete,
}: CategoriasTableProps) {
  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700/60">
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            Carregando categorias...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (categorias.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700/60">
        <CardContent className="py-12 text-center text-muted-foreground">
          Nenhuma categoria cadastrada ainda.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Categorias ({categorias.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Criada em
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Última atualização
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {categorias.map((categoria) => (
                <tr key={categoria.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full border"
                        style={{
                          backgroundColor: categoria.cor || undefined,
                          borderColor: categoria.cor || undefined,
                        }}
                      >
                        {!categoria.cor && (
                          <span className="text-xs text-muted-foreground">
                            ?
                          </span>
                        )}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {categoria.nome}
                        </p>
                        {categoria.descricao && (
                          <p className="text-xs text-muted-foreground">
                            {categoria.descricao}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        categoria.tipo === "RECEITA"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                      }`}
                    >
                      {categoria.tipo === "RECEITA" ? "Receita" : "Despesa"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        categoria.ativa
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          : "bg-gray-200 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300"
                      }`}
                    >
                      {categoria.ativa ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDate(categoria.dataCriacao)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {categoria.dataAtualizacao
                      ? formatDate(categoria.dataAtualizacao)
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => onEdit(categoria)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(categoria)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
