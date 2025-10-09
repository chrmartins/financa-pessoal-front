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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCategoriaCreate } from "@/hooks/queries/categorias/use-categoria-create";
import { useCategoriaUpdate } from "@/hooks/queries/categorias/use-categoria-update";
import type { CategoriaResponse } from "@/types";
import { cn } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { categoriaSchema, type CategoriaFormValues } from "../schema";

interface CategoriaFormModalProps {
  categoria?: CategoriaResponse | null;
  open: boolean;
  onClose: () => void;
}

const DEFAULT_COLOR = "#2563eb";

export function CategoriaFormModal({
  categoria,
  open,
  onClose,
}: CategoriaFormModalProps) {
  const isEdit = Boolean(categoria);

  const form = useForm<CategoriaFormValues>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      tipo: "DESPESA",
      cor: DEFAULT_COLOR,
      ativa: true,
    },
  });

  const createMutation = useCategoriaCreate();
  const updateMutation = useCategoriaUpdate();

  useEffect(() => {
    if (open) {
      form.reset({
        nome: categoria?.nome ?? "",
        descricao: categoria?.descricao ?? "",
        tipo: categoria?.tipo ?? "DESPESA",
        cor: categoria?.cor ?? DEFAULT_COLOR,
        ativa: categoria?.ativa ?? true,
      });
    }
  }, [categoria, form, open]);

  const handleClose = () => {
    onClose();
    form.reset({
      nome: "",
      descricao: "",
      tipo: "DESPESA",
      cor: DEFAULT_COLOR,
      ativa: true,
    });
  };

  const onSubmit = async (values: CategoriaFormValues) => {
    const payload = {
      ...values,
      descricao: values.descricao?.trim() || undefined,
      cor: values.cor?.trim() || undefined,
    };

    try {
      if (isEdit && categoria) {
        await updateMutation.mutateAsync({
          id: categoria.id,
          data: payload,
        });
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Categoria criada com sucesso!");
      }
      handleClose();
    } catch (error) {
      console.error("Erro ao salvar categoria", error);
      toast.error("Não foi possível salvar a categoria.");
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(value) => !value && handleClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Atualize as informações da categoria selecionada."
              : "Cadastre uma nova categoria para organizar suas transações."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Alimentação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RECEITA">Receita</SelectItem>
                        <SelectItem value="DESPESA">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Input
                          type="color"
                          className={cn("w-12 h-10 p-1", "cursor-pointer")}
                          value={field.value || DEFAULT_COLOR}
                          onChange={(event) =>
                            field.onChange(event.target.value)
                          }
                        />
                        <Input
                          value={field.value || ""}
                          placeholder="#2563eb"
                          onChange={(event) =>
                            field.onChange(event.target.value)
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhes adicionais sobre a categoria"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ativa"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Categoria ativa</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Controle se a categoria pode ser utilizada nas transações.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-dashed"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEdit ? "Salvar alterações" : "Criar categoria"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
