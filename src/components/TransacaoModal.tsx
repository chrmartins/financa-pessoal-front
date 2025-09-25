import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import { useUpdateTransacao } from "@/hooks/mutations/transacoes/use-update-transacao";
import { useCategorias } from "@/hooks/queries/categorias/use-categorias";
import { useCreateTransacao } from "@/hooks/queries/transacoes";
import type { TransacaoFormData } from "@/schemas";
import { transacaoSchema } from "@/schemas";
import type { TransacaoResponse, UpdateTransacaoRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface TransacaoModalProps {
  open: boolean;
  onClose: () => void;
  transacao?: TransacaoResponse | null; // Se fornecido, é edição; se null/undefined, é criação
}

export function TransacaoModal({
  open,
  onClose,
  transacao,
}: TransacaoModalProps) {
  const isEditing = Boolean(transacao);
  const { mutate: createTransacao, isPending: isCreating } =
    useCreateTransacao();
  const updateTransacao = useUpdateTransacao();

  const { data: categorias = [], isLoading: categoriasLoading } =
    useCategorias();

  const form = useForm<TransacaoFormData>({
    resolver: zodResolver(transacaoSchema),
    defaultValues: {
      descricao: "",
      valor: 0,
      dataTransacao: new Date().toISOString().split("T")[0],
      tipo: "DESPESA",
      categoriaId: "",
      observacoes: "",
    },
  });

  const watchedTipo = form.watch("tipo");

  // Carregar dados da transação quando for edição
  useEffect(() => {
    if (isEditing && transacao && open) {
      console.log("🔍 Debug - Transação para edição:", transacao);
      console.log("🔍 Debug - Categoria da transação:", transacao.categoria);
      console.log("🔍 Debug - CategoriaId:", transacao.categoriaId);
      console.log("🔍 Debug - Categorias disponíveis:", categorias);

      // Tentar encontrar a categoria correspondente
      let categoriaIdParaUsar = "";

      // Prioridade 1: Usar o ID da categoria diretamente se existe
      if (transacao.categoria?.id) {
        categoriaIdParaUsar = transacao.categoria.id;
      }
      // Prioridade 2: Tentar encontrar por nome da categoria
      else if (transacao.categoria?.nome) {
        const categoriaEncontrada = categorias.find(
          (cat) =>
            cat.nome === transacao.categoria?.nome &&
            cat.tipo === transacao.tipo
        );
        categoriaIdParaUsar = categoriaEncontrada?.id || "";
      }
      // Prioridade 3: Usar o categoriaId convertido
      else if (transacao.categoriaId) {
        categoriaIdParaUsar = transacao.categoriaId.toString();
      }

      console.log(
        "🔍 Debug - CategoriaId que será usado:",
        categoriaIdParaUsar
      );

      form.reset({
        descricao: transacao.descricao,
        valor: transacao.valor,
        dataTransacao: transacao.dataTransacao,
        tipo: transacao.tipo,
        categoriaId: categoriaIdParaUsar,
        observacoes: transacao.observacoes || "",
      });
    } else if (!isEditing && open) {
      // Reset para valores padrão quando for criação
      form.reset({
        descricao: "",
        valor: 0,
        dataTransacao: new Date().toISOString().split("T")[0],
        tipo: "DESPESA",
        categoriaId: "",
        observacoes: "",
      });
    }
  }, [isEditing, transacao, open, form, categorias]);

  // Resetar formulário quando fechar
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (data: TransacaoFormData) => {
    try {
      if (isEditing && transacao) {
        // Atualizar transação existente
        const updateData: UpdateTransacaoRequest = {
          descricao: data.descricao,
          valor: data.valor,
          dataTransacao: data.dataTransacao,
          categoriaId: data.categoriaId,
          observacoes: data.observacoes,
        };

        await updateTransacao.mutateAsync({
          id: transacao.id,
          data: updateData,
        });

        toast.success("Transação atualizada com sucesso!", {
          description: `${data.descricao} foi atualizada.`,
        });
      } else {
        // Criar nova transação
        createTransacao(data, {
          onSuccess: () => {
            toast.success("Transação criada com sucesso!", {
              description: `${
                data.tipo === "RECEITA" ? "Receita" : "Despesa"
              } de ${new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(data.valor)} foi adicionada.`,
            });
            onClose();
            form.reset();
          },
          onError: () => {
            toast.error("Erro ao criar transação", {
              description: "Ocorreu um erro inesperado.",
            });
          },
        });
        return; // Não chama onClose() aqui porque já está no onSuccess
      }

      onClose();
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      toast.error("Erro ao atualizar transação", {
        description: "Ocorreu um erro inesperado.",
      });
    }
  };

  // Filtrar categorias por tipo
  const categoriasFiltradas = categorias.filter(
    (categoria) => categoria.tipo === watchedTipo
  );

  console.log("🔍 Debug - Tipo selecionado:", watchedTipo);
  console.log("🔍 Debug - Categorias filtradas:", categoriasFiltradas);
  console.log(
    "🔍 Debug - Valor atual do campo categoriaId:",
    form.watch("categoriaId")
  );

  const isSubmitting = updateTransacao.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            {isEditing ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Descrição */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Descrição *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Supermercado, Salário..."
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Valor */}
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Valor *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data */}
              <FormField
                control={form.control}
                name="dataTransacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Data *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Tipo */}
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Tipo *
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("categoriaId", ""); // Reset categoria quando mudar tipo
                      }}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
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

              {/* Categoria */}
              <FormField
                control={form.control}
                name="categoriaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Categoria *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={categoriasLoading || !watchedTipo}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                          <SelectValue
                            placeholder={
                              categoriasLoading
                                ? "Carregando..."
                                : !watchedTipo
                                ? "Selecione o tipo primeiro"
                                : "Selecione a categoria"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriasFiltradas.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            {categoria.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Observações */}
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Observações
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações adicionais (opcional)"
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botões */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
