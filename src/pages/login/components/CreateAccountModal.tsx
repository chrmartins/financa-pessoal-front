import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UsuarioService } from "@/services/usuarios/usuario-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createAccountSchema = z
  .object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z
      .string()
      .min(1, "Email é obrigatório")
      .email("Email inválido")
      .toLowerCase(),
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmarSenha: z.string().min(6, "Confirmação de senha obrigatória"),
  })
  .refine((values) => values.senha === values.confirmarSenha, {
    message: "As senhas não conferem",
    path: ["confirmarSenha"],
  });

export type CreateAccountFormValues = z.infer<typeof createAccountSchema>;

interface CreateAccountModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (payload: { email: string; senha: string }) => void;
}

export function CreateAccountModal({
  open,
  onClose,
  onSuccess,
}: CreateAccountModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  const resetAndClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = async (values: CreateAccountFormValues) => {
    setIsSubmitting(true);

    try {
      await UsuarioService.criar({
        nome: values.nome,
        email: values.email,
        senha: values.senha,
        papel: "USER",
        ativo: true,
      });

      toast.success("Conta criada com sucesso!", {
        description: "Use suas credenciais para fazer login.",
      });

      onSuccess?.({ email: values.email, senha: values.senha });
      resetAndClose();
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? error.response?.data?.message || "Não foi possível criar a conta."
        : error instanceof Error
        ? error.message
        : "Não foi possível criar a conta.";

      console.error("Erro ao criar conta:", error);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && resetAndClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar conta</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar uma nova conta de usuário.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmarSenha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Repita a senha"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={resetAndClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Criando conta...
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
