import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsuarioModal } from "@/components/usuarioModal";
import { useUsuarioDelete } from "@/hooks/queries/usuarios/use-usuario-delete";
import { useUsuarioDeletarPermanentemente } from "@/hooks/queries/usuarios/use-usuario-delete-permanente";
import { useUsuariosList } from "@/hooks/queries/usuarios/use-usuarios-list";
import { useUserStore } from "@/stores/auth/use-user-store";
import type { Usuario } from "@/types";
import { isAxiosError } from "axios";
import { Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DeleteUsuarioPermanentementeModal } from "./components/DeleteUsuarioPermanentementeModal";
import { UsuariosTable } from "./components/UsuariosTable";

export default function UsuariosPage() {
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [papelFiltro, setPapelFiltro] = useState<"TODOS" | "ADMIN" | "USUARIO">(
    "TODOS"
  );
  const [statusFiltro, setStatusFiltro] = useState<
    "TODOS" | "ATIVO" | "INATIVO"
  >("TODOS");

  const { user: currentUser } = useUserStore();
  const isAdmin = currentUser?.papel === "ADMIN";

  const { data, isLoading, isError } = useUsuariosList();
  const { mutate: desativarUsuario, isPending: isDesativando } =
    useUsuarioDelete();
  const { mutate: deletarPermanentemente, isPending: isDeletando } =
    useUsuarioDeletarPermanentemente();

  const usuarios = useMemo(() => data ?? [], [data]);

  // Aplicar filtros de busca, papel e status
  const usuariosFiltrados = useMemo(() => {
    let resultado = usuarios;

    // Filtro de busca por texto (nome ou e-mail)
    if (searchTerm.trim()) {
      const termoBusca = searchTerm.toLowerCase().trim();
      resultado = resultado.filter((u) => {
        const nome = u.nome?.toLowerCase() || "";
        const email = u.email?.toLowerCase() || "";

        return nome.includes(termoBusca) || email.includes(termoBusca);
      });
    }

    // Filtro por papel (ADMIN/USUARIO)
    if (papelFiltro !== "TODOS") {
      resultado = resultado.filter((u) => u.papel === papelFiltro);
    }

    // Filtro por status (ATIVO/INATIVO)
    if (statusFiltro !== "TODOS") {
      resultado = resultado.filter((u) => {
        const isAtivo = u.ativo;
        return statusFiltro === "ATIVO" ? isAtivo : !isAtivo;
      });
    }

    return resultado;
  }, [usuarios, searchTerm, papelFiltro, statusFiltro]);

  // Função para limpar todos os filtros
  const limparFiltros = () => {
    setSearchTerm("");
    setPapelFiltro("TODOS");
    setStatusFiltro("TODOS");
  };

  const temFiltrosAtivos =
    searchTerm || papelFiltro !== "TODOS" || statusFiltro !== "TODOS";

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

      {/* Barra de busca e filtros */}
      <div className="space-y-4">
        {/* Busca por texto */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9 h-10"
            autoComplete="off"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted"
              aria-label="Limpar busca"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Filtro por papel */}
          <Select
            value={papelFiltro}
            onValueChange={(value: any) => setPapelFiltro(value)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue>
                {papelFiltro === "ADMIN" && "🔑 Administradores"}
                {papelFiltro === "USUARIO" && "👤 Usuários"}
                {papelFiltro === "TODOS" && "Todos os papéis"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos os papéis</SelectItem>
              <SelectItem value="ADMIN">🔑 Administradores</SelectItem>
              <SelectItem value="USUARIO">👤 Usuários</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtro por status */}
          <Select
            value={statusFiltro}
            onValueChange={(value: any) => setStatusFiltro(value)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue>
                {statusFiltro === "ATIVO" && "✅ Ativos"}
                {statusFiltro === "INATIVO" && "❌ Inativos"}
                {statusFiltro === "TODOS" && "Todos os status"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos os status</SelectItem>
              <SelectItem value="ATIVO">✅ Ativos</SelectItem>
              <SelectItem value="INATIVO">❌ Inativos</SelectItem>
            </SelectContent>
          </Select>

          {/* Botão limpar filtros */}
          {temFiltrosAtivos && (
            <Button
              variant="outline"
              onClick={limparFiltros}
              className="sm:w-auto w-full"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Contador de resultados */}
        {temFiltrosAtivos && (
          <div className="text-sm text-muted-foreground">
            {usuariosFiltrados.length === 0 ? (
              <span>Nenhum usuário encontrado com os filtros aplicados</span>
            ) : (
              <span>
                {usuariosFiltrados.length}{" "}
                {usuariosFiltrados.length === 1
                  ? "usuário encontrado"
                  : "usuários encontrados"}
                {usuarios.length > usuariosFiltrados.length &&
                  ` de ${usuarios.length} no total`}
              </span>
            )}
          </div>
        )}
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
          usuarios={usuariosFiltrados}
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
