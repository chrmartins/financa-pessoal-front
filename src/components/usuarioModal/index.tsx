import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUsuarioCreate } from "@/hooks/queries/usuarios/use-usuario-create";
import { useUsuarioUpdate } from "@/hooks/queries/usuarios/use-usuario-update";
import {
  createUsuarioSchema,
  updateUsuarioSchema,
  type CreateUsuarioFormData,
  type UpdateUsuarioFormData,
} from "@/schemas";
import type { Usuario } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface UsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario?: Usuario;
}

export function UsuarioModal({
  open,
  onOpenChange,
  usuario,
}: UsuarioModalProps) {
  const isEditing = !!usuario;
  const { mutate: createUsuario, isPending: isCreating } = useUsuarioCreate();
  const { mutate: updateUsuario, isPending: isUpdating } = useUsuarioUpdate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUsuarioFormData | UpdateUsuarioFormData>({
    resolver: zodResolver(
      isEditing ? updateUsuarioSchema : createUsuarioSchema
    ),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      papel: "USER",
      ativo: true,
    },
  });

  const papel = watch("papel");
  const ativo = watch("ativo");

  useEffect(() => {
    if (usuario) {
      reset({
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
        ativo: usuario.ativo,
        senha: "", // Senha vazia ao editar
      });
    } else {
      reset({
        nome: "",
        email: "",
        senha: "",
        papel: "USER",
        ativo: true,
      });
    }
  }, [usuario, reset]);

  const onSubmit = (data: CreateUsuarioFormData | UpdateUsuarioFormData) => {
    if (isEditing && usuario) {
      // Ao editar, remove senha se estiver vazia
      const updateData: UpdateUsuarioFormData = { ...data };
      if (!updateData.senha) {
        delete updateData.senha;
      }
      updateUsuario(
        { id: usuario.id, data: updateData },
        {
          onSuccess: () => {
            onOpenChange(false);
            reset();
          },
          onError: (error) => {
            console.error("Erro ao atualizar usuário:", error);

            const message = isAxiosError(error)
              ? error.response?.data?.message || error.message
              : error instanceof Error
              ? error.message
              : "Erro ao atualizar usuário. Verifique se o email já está em uso.";

            alert(message);
          },
        }
      );
    } else {
      createUsuario(data as CreateUsuarioFormData, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
        onError: (error) => {
          console.error("Erro ao criar usuário:", error);

          const message = isAxiosError(error)
            ? error.response?.data?.message || error.message
            : error instanceof Error
            ? error.message
            : "Erro ao criar usuário. Verifique se o email já está em uso.";

          alert(message);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do usuário. Deixe a senha vazia para não alterá-la."
              : "Preencha as informações para criar um novo usuário."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              placeholder="João Silva"
              {...register("nome")}
              disabled={isCreating || isUpdating}
            />
            {errors.nome && (
              <p className="text-sm text-red-500">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              placeholder="joao@exemplo.com"
              {...register("email")}
              disabled={isCreating || isUpdating}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha">
              Senha {isEditing ? "(deixe vazio para não alterar)" : "*"}
            </Label>
            <Input
              id="senha"
              type="password"
              placeholder={isEditing ? "••••••" : "Mínimo 6 caracteres"}
              {...register("senha")}
              disabled={isCreating || isUpdating}
            />
            {errors.senha && (
              <p className="text-sm text-red-500">{errors.senha.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="papel">Papel *</Label>
            <Select
              value={papel}
              onValueChange={(value) =>
                setValue("papel", value as "ADMIN" | "USER")
              }
              disabled={isCreating || isUpdating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">USER - Usuário comum</SelectItem>
                <SelectItem value="ADMIN">ADMIN - Administrador</SelectItem>
              </SelectContent>
            </Select>
            {errors.papel && (
              <p className="text-sm text-red-500">{errors.papel.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label>Usuário Ativo</Label>
              <p className="text-sm text-muted-foreground">
                Desative para bloquear o acesso do usuário
              </p>
            </div>
            <Switch
              checked={ativo}
              onCheckedChange={(checked: boolean) => setValue("ativo", checked)}
              disabled={isCreating || isUpdating}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating || isUpdating}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                ? "Salvando..."
                : isEditing
                ? "Atualizar"
                : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
