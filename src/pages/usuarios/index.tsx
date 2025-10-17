import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UsuarioModal } from "@/components/usuarioModal";
import { useUsuarioDelete } from "@/hooks/queries/usuarios/use-usuario-delete";
import { useUsuarioDeletarPermanentemente } from "@/hooks/queries/usuarios/use-usuario-delete-permanente";
import { useUsuariosList } from "@/hooks/queries/usuarios/use-usuarios-list";
import { useUserStore } from "@/stores/auth/use-user-store";
import type { Usuario } from "@/types";
import { isAxiosError } from "axios";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DeleteUsuarioPermanentementeModal } from "./components/DeleteUsuarioPermanentementeModal";
import { UsuariosTable } from "./components/UsuariosTable";

export default function UsuariosPage() {
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { user: currentUser } = useUserStore();
  const isAdmin = currentUser?.papel === "ADMIN";

  const { data, isLoading, isError } = useUsuariosList();
  const { mutate: desativarUsuario, isPending: isDesativando } =
    useUsuarioDelete();
  const { mutate: deletarPermanentemente, isPending: isDeletando } =
    useUsuarioDeletarPermanentemente();

  const usuarios = useMemo(() => data ?? [], [data]);

  const handleCreate = () => {
    setSelectedUsuario(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsFormModalOpen(true);
  };

  const handleDeactivate = (usuario: Usuario) => {
    desativarUsuario(usuario.id, {
      onSuccess: () => {
        toast.success("Usuário desativado com sucesso!");
      },
      onError: (error) => {
        console.error("Erro ao desativar usuário:", error);

        const message = isAxiosError(error)
          ? error.response?.data?.message || error.message
          : error instanceof Error
          ? error.message
          : "Erro ao desativar usuário.";

        toast.error(message);
      },
    });
  };

  const handleDelete = (usuario: Usuario) => {
    // Verifica se está tentando deletar a si mesmo
    if (usuario.id === currentUser?.id) {
      toast.error("Você não pode deletar sua própria conta!", {
        description:
          "Para deletar sua conta, peça para outro administrador fazer isso.",
      });
      return;
    }

    setSelectedUsuario(usuario);
    setIsDeleteModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedUsuario(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUsuario(null);
  };

  const confirmarDeletarPermanentemente = (id: string) => {
    deletarPermanentemente(id, {
      onSuccess: () => {
        toast.success(
          "Usuário deletado permanentemente com sucesso! Todas as transações e categorias relacionadas foram removidas."
        );
        handleCloseDeleteModal();
      },
      onError: (error) => {
        console.error("Erro ao deletar usuário:", error);

        let message = "Erro ao deletar usuário permanentemente.";
        let description = "";

        if (isAxiosError(error)) {
          if (error.response?.status === 403) {
            message = "Acesso negado - Erro 403";
            description =
              "Possíveis causas:\n" +
              "• Token JWT expirado ou inválido\n" +
              "• Backend espera formato de role diferente (ex: ROLE_ADMIN)\n" +
              "• Você está tentando deletar sua própria conta\n" +
              "• Permissões insuficientes no backend";
          } else if (error.response?.status === 404) {
            message = "Usuário não encontrado.";
          } else {
            message = error.response?.data?.message || error.message;
          }
        } else if (error instanceof Error) {
          message = error.message;
        }

        toast.error(message, description ? { description } : undefined);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Usuários
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os usuários do sistema (apenas ADMIN).
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo usuário
        </Button>
      </div>

      {isError ? (
        <Card className="border-destructive/30 bg-destructive/10 text-destructive">
          <CardContent className="py-6">
            <p>
              Não foi possível carregar os usuários. Tente novamente mais tarde.
            </p>
          </CardContent>
        </Card>
      ) : (
        <UsuariosTable
          usuarios={usuarios}
          isLoading={isLoading}
          currentUserId={currentUser?.id}
          isAdmin={isAdmin}
          onEdit={handleEdit}
          onDeactivate={handleDeactivate}
          onDelete={handleDelete}
          isDeactivating={isDesativando}
          isDeleting={isDeletando}
        />
      )}

      <UsuarioModal
        open={isFormModalOpen}
        onOpenChange={handleCloseFormModal}
        usuario={selectedUsuario || undefined}
      />

      <DeleteUsuarioPermanentementeModal
        open={isDeleteModalOpen}
        onOpenChange={handleCloseDeleteModal}
        usuario={selectedUsuario}
        onConfirm={confirmarDeletarPermanentemente}
        isDeleting={isDeletando}
      />
    </div>
  );
}
