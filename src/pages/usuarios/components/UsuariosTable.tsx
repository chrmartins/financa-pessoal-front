import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Usuario } from "@/types";
import { formatDate } from "@/utils";
import { Pencil, Trash2, UserX } from "lucide-react";

interface UsuariosTableProps {
  usuarios: Usuario[];
  isLoading?: boolean;
  currentUserId?: string;
  isAdmin?: boolean;
  onEdit: (usuario: Usuario) => void;
  onDeactivate: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
  isDeactivating?: boolean;
  isDeleting?: boolean;
}

export function UsuariosTable({
  usuarios,
  isLoading = false,
  currentUserId,
  isAdmin = false,
  onEdit,
  onDeactivate,
  onDelete,
  isDeactivating = false,
  isDeleting = false,
}: UsuariosTableProps) {
  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700/60">
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            Carregando usuários...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (usuarios.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700/60">
        <CardContent className="py-12 text-center text-muted-foreground">
          Nenhum usuário cadastrado ainda.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Usuários ({usuarios.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Visualização Desktop - Tabela */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  E-mail
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Papel
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Último Acesso
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {usuarios.map((usuario) => {
                const isCurrentUser = usuario.id === currentUserId;
                return (
                  <tr key={usuario.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {usuario.nome}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              (Você)
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {usuario.id.slice(0, 8)}...
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground">{usuario.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          usuario.papel === "ADMIN"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        }`}
                      >
                        {usuario.papel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          usuario.ativo
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300"
                        }`}
                      >
                        {usuario.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {usuario.ultimoAcesso
                        ? formatDate(usuario.ultimoAcesso)
                        : "Nunca acessou"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => onEdit(usuario)}
                          title="Editar usuário"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {usuario.ativo && !isCurrentUser && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-orange-600"
                            onClick={() => onDeactivate(usuario)}
                            disabled={isDeactivating}
                            title="Desativar usuário"
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        )}
                        {isAdmin && !isCurrentUser && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => onDelete(usuario)}
                            disabled={isDeleting}
                            title="Deletar permanentemente"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Visualização Mobile - Cards */}
        <div className="md:hidden divide-y divide-border">
          {usuarios.map((usuario) => {
            const isCurrentUser = usuario.id === currentUserId;
            return (
              <div
                key={usuario.id}
                className="p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {usuario.nome}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (Você)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {usuario.email}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      ID: {usuario.id.slice(0, 8)}...
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          usuario.papel === "ADMIN"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        }`}
                      >
                        {usuario.papel}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          usuario.ativo
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300"
                        }`}
                      >
                        {usuario.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Último acesso:{" "}
                      {usuario.ultimoAcesso
                        ? formatDate(usuario.ultimoAcesso)
                        : "Nunca acessou"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                      onClick={() => onEdit(usuario)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    {usuario.ativo && !isCurrentUser && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-orange-600"
                        onClick={() => onDeactivate(usuario)}
                        disabled={isDeactivating}
                      >
                        <UserX className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {isAdmin && !isCurrentUser && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(usuario)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
