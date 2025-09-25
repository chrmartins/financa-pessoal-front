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
import { useCategorias } from "@/hooks/queries/categorias";
import { useCreateTransacao } from "@/hooks/queries/transacoes";
import type { TransacaoFormData } from "@/schemas";
import { transacaoSchema } from "@/schemas";
import { useModalStore } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function SimpleTransactionForm() {
  const { createTransacaoOpen, setCreateTransacaoOpen } = useModalStore();
  const { mutate: createTransacao, isPending } = useCreateTransacao();
  const {
    data: categorias,
    isLoading: isLoadingCategorias,
    error: categoriasError,
  } = useCategorias();

  const form = useForm<TransacaoFormData>({
    resolver: zodResolver(transacaoSchema),
    defaultValues: {
      descricao: "",
      valor: 0,
      dataTransacao: new Date().toISOString().split("T")[0],
      tipo: "DESPESA",
      categoriaId: "750e8400-e29b-41d4-a716-446655440001", // Default para Alimentação
      observacoes: "",
    },
  });

  const onSubmit = (data: TransacaoFormData) => {
    console.log("🚀 Dados do formulário:", data);

    // Validação adicional antes de enviar
    if (!data.descricao?.trim()) {
      toast.error("Erro de validação", {
        description: "Descrição é obrigatória",
      });
      return;
    }

    if (data.valor <= 0) {
      toast.error("Erro de validação", {
        description: "Valor deve ser maior que zero",
      });
      return;
    }

    toast.info("Enviando transação...", {
      description: "Aguarde enquanto salvamos os dados",
    });

    createTransacao(data, {
      onSuccess: (response) => {
        form.reset();
        setCreateTransacaoOpen(false);
        toast.success("Transação criada com sucesso!", {
          description: `${
            data.tipo === "RECEITA" ? "Receita" : "Despesa"
          } de ${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(data.valor)} foi adicionada.`,
          duration: 5000,
        });
        console.log("✅ Transação criada:", response);
      },
      onError: (error: any) => {
        console.error("❌ Erro ao criar transação:", error);

        let errorMessage = "Erro desconhecido";
        let errorDescription = "Não foi possível salvar a transação.";

        if (error.response) {
          errorMessage = `Erro ${error.response.status}`;
          errorDescription =
            error.response.data?.message ||
            error.response.data?.error ||
            `Servidor retornou: ${error.response.statusText}`;

          toast.error(errorMessage, {
            description: errorDescription,
            duration: 8000,
          });
          return;
        }

        if (error.request) {
          errorMessage = "Erro de conexão";
          errorDescription =
            "Não foi possível conectar com a API. Verifique se está rodando em http://localhost:8080";

          toast.error(errorMessage, {
            description: errorDescription,
            duration: 8000,
          });
          return;
        }

        errorMessage = "Erro interno";
        errorDescription = error.message || "Erro desconhecido";

        toast.error(errorMessage, {
          description: errorDescription,
          duration: 8000,
        });
      },
    });
  };

  const handleClose = () => {
    form.reset();
    setCreateTransacaoOpen(false);
  };

  return (
    <Dialog open={createTransacaoOpen} onOpenChange={setCreateTransacaoOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Nova Transação
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descrição da transação"
                        {...field}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataTransacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="focus:ring-blue-500">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RECEITA">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Receita</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="DESPESA">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>Despesa</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoriaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:ring-blue-500">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingCategorias ? (
                        <SelectItem value="loading" disabled>
                          <span>Carregando categorias...</span>
                        </SelectItem>
                      ) : categoriasError ? (
                        <SelectItem value="error" disabled>
                          <span>Erro ao carregar categorias</span>
                        </SelectItem>
                      ) : !categorias || categorias.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          <span>Nenhuma categoria encontrada</span>
                        </SelectItem>
                      ) : (
                        categorias?.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  categoria.tipo === "RECEITA"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                              <span>{categoria.nome}</span>
                              {categoria.descricao && (
                                <span className="text-xs text-gray-500">
                                  ({categoria.descricao})
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre a transação..."
                      className="resize-none focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Transação"
                  )}
                </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
