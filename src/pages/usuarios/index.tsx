import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { UsuarioModal } from "@/components/usuarioModal";
import { useUsuarioDelete } from "@/hooks/queries/usuarios/use-usuario-delete";
import { useUsuariosList } from "@/hooks/queries/usuarios/use-usuarios-list";
import type { Usuario } from "@/types";
import { formatDate } from "@/utils";
import { isAxiosError } from "axios";
import { Pencil, Plus, UserX, Users } from "lucide-react";
import { useState } from "react";

export default function UsuariosPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<
    Usuario | undefined
  >(undefined);

  const { data: usuarios, isLoading } = useUsuariosList();
  const { mutate: desativarUsuario, isPending: isDesativando } =
    useUsuarioDelete();

  const handleNovoUsuario = () => {
    setUsuarioSelecionado(undefined);
    setModalOpen(true);
  };

  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setModalOpen(true);
  };

  const handleDesativarUsuario = (usuario: Usuario) => {
    if (
      window.confirm(
        `Tem certeza que deseja desativar o usuário ${usuario.nome}? Ele não poderá mais acessar o sistema.`
      )
    ) {
      desativarUsuario(usuario.id, {
        onSuccess: () => {
          alert("Usuário desativado com sucesso!");
        },
        onError: (error) => {
          console.error("Erro ao desativar usuário:", error);

          const message = isAxiosError(error)
            ? error.response?.data?.message || error.message
            : error instanceof Error
            ? error.message
            : "Erro ao desativar usuário.";

          alert(message);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 sm:h-8 sm:w-8" />
            Gerenciamento de Usuários
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Gerencie os usuários do sistema (apenas ADMIN)
          </p>
        </div>
        <Button onClick={handleNovoUsuario} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
          <CardDescription>
            Total de {usuarios?.length || 0} usuário(s) ativo(s) no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!usuarios || usuarios.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum usuário cadastrado ainda.
              </p>
              <Button onClick={handleNovoUsuario} className="mt-4">
                Criar Primeiro Usuário
              </Button>
            </div>
          ) : (
            <>
              {/* Visualização Desktop - Tabela */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Nome</th>
                      <th className="text-left p-4 font-medium">E-mail</th>
                      <th className="text-left p-4 font-medium">Papel</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">
                        Último Acesso
                      </th>
                      <th className="text-right p-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr
                        key={usuario.id}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{usuario.nome}</p>
                            <p className="text-sm text-muted-foreground">
                              ID: {usuario.id.slice(0, 8)}...
                            </p>
                          </div>
                        </td>
                        <td className="p-4">{usuario.email}</td>
                        <td className="p-4">
                          <Badge
                            variant={
                              usuario.papel === "ADMIN"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {usuario.papel}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={usuario.ativo ? "default" : "destructive"}
                          >
                            {usuario.ativo ? "Ativo" : "Inativo"}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {usuario.ultimoAcesso
                            ? formatDate(usuario.ultimoAcesso)
                            : "Nunca acessou"}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditarUsuario(usuario)}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            {usuario.ativo && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDesativarUsuario(usuario)}
                                disabled={isDesativando}
                              >
                                <UserX className="h-4 w-4 mr-1" />
                                Desativar
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Visualização Mobile - Cards */}
              <div className="md:hidden divide-y divide-border">
                {usuarios.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">
                            {usuario.nome}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {usuario.email}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            ID: {usuario.id.slice(0, 8)}...
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                          <Badge
                            variant={
                              usuario.papel === "ADMIN"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {usuario.papel}
                          </Badge>
                          <Badge
                            variant={usuario.ativo ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {usuario.ativo ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Último acesso:{" "}
                        {usuario.ultimoAcesso
                          ? formatDate(usuario.ultimoAcesso)
                          : "Nunca acessou"}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditarUsuario(usuario)}
                          className="w-full sm:flex-1"
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1.5" />
                          Editar
                        </Button>
                        {usuario.ativo && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDesativarUsuario(usuario)}
                            disabled={isDesativando}
                            className="w-full sm:flex-1"
                          >
                            <UserX className="h-3.5 w-3.5 mr-1.5" />
                            Desativar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <UsuarioModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        usuario={usuarioSelecionado}
      />
    </div>
  );
}
