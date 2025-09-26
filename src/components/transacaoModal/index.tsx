import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import { useCategoriasList } from "@/hooks/queries/categorias/use-categorias-list";
import { useTransacaoCreate } from "@/hooks/queries/transacoes/use-transacao-create";
import type { CreateTransacaoRequest } from "@/types";
import { formatCurrencyInput, parseCurrencyInput } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Clock, Loader2, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { TransacaoModalProps } from "./interface";
import { getCategoriaColor, getExemploTexto, opcoesQuantidade } from "./utils";
import { formSchema, type FormData } from "./validations";

export function TransacaoModal({
  open,
  onClose,
  transacao,
}: TransacaoModalProps) {
  const isEditing = Boolean(transacao);

  const {
    register,
    handleSubmit: onSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descricao: "",
      valorFormatado: "",
      dataTransacao: new Date().toISOString().split("T")[0],
      tipo: "DESPESA",
      categoriaId: "",
      observacoes: "",
      recorrente: false,
      quantidadeParcelas: 2,
    },
  });

  const recorrente = watch("recorrente");
  const quantidadeParcelas = watch("quantidadeParcelas");
  const valorFormatado = watch("valorFormatado");
  const tipo = watch("tipo");

  const { mutate: createTransacao, isPending: isCreating } = useTransacaoCreate(
    {
      onSuccess: () => {
        toast.success(
          isEditing
            ? "Transação atualizada com sucesso!"
            : "Transação criada com sucesso!"
        );
        onClose();
      },
      onError: (error) => {
        toast.error(
          error?.message || "Erro ao processar transação. Tente novamente."
        );
      },
    }
  );

  const { data: categorias = [], isLoading: loadingCategorias } =
    useCategoriasList();

  // Filtrar categorias baseado no tipo selecionado
  const categoriasFiltradas = categorias.filter(
    (categoria) => categoria.tipo === tipo
  );

  // Limpar categoria selecionada quando o tipo mudar (para evitar incompatibilidade)
  useEffect(() => {
    const categoriaAtual = watch("categoriaId");
    if (categoriaAtual && categorias.length > 0) {
      const categoriaEncontrada = categorias.find(
        (c) => c.id === categoriaAtual
      );
      if (categoriaEncontrada && categoriaEncontrada.tipo !== tipo) {
        setValue("categoriaId", "");
      }
    }
  }, [tipo, categorias, setValue, watch]);

  // Resetar formulário quando abrir/fechar modal
  useEffect(() => {
    if (open) {
      if (transacao) {
        const valorEmCents = Math.round(transacao.valor * 100).toString();
        reset({
          descricao: transacao.descricao,
          valorFormatado: formatCurrencyInput(valorEmCents),
          dataTransacao: transacao.dataTransacao,
          tipo: transacao.tipo,
          categoriaId: transacao.categoria.id,
          observacoes: transacao.observacoes || "",
          recorrente: transacao.recorrente || false,
          quantidadeParcelas: transacao.quantidadeParcelas || 2,
        });
      } else {
        reset({
          descricao: "",
          valorFormatado: "",
          dataTransacao: new Date().toISOString().split("T")[0],
          tipo: "DESPESA",
          categoriaId: "",
          observacoes: "",
          recorrente: false,
          quantidadeParcelas: 2,
        });
      }
    }
  }, [open, transacao, reset]);

  // Função para formatar valor conforme usuário digita
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatCurrencyInput(inputValue);
    setValue("valorFormatado", formatted);
  };

  const handleSubmit = onSubmit((data: FormData) => {
    // Converter valor formatado para número
    const valorNumerico = parseCurrencyInput(data.valorFormatado);

    // Validar dados básicos
    if (!data.categoriaId) {
      toast.error("Por favor, selecione uma categoria");
      return;
    }

    if (valorNumerico <= 0) {
      toast.error("Valor deve ser maior que zero");
      return;
    }

    const requestData: CreateTransacaoRequest = {
      descricao: data.descricao.trim(),
      valor: valorNumerico,
      dataTransacao: data.dataTransacao,
      tipo: data.tipo,
      categoriaId: data.categoriaId,
      observacoes: data.observacoes?.trim() || "",
      recorrente: data.recorrente,
      quantidadeParcelas: data.recorrente ? data.quantidadeParcelas : undefined,
      tipoRecorrencia: data.recorrente ? "MENSAL" : undefined,
      valorTotalOriginal: data.recorrente
        ? valorNumerico * data.quantidadeParcelas
        : undefined,
    };

    createTransacao(requestData);
  });

  // Encontrar categoria selecionada
  const categoriaId = watch("categoriaId");
  const categoriaSelecionada = categorias.find((c) => c.id === categoriaId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Clock className="h-5 w-5" />
                Editar Transação
              </>
            ) : (
              <>
                <CalendarDays className="h-5 w-5" />
                Nova Transação
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Descrição */}
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              placeholder="Ex: iPhone, Netflix, Salário..."
              {...register("descricao")}
            />
            {errors.descricao && (
              <p className="text-sm text-red-500 mt-1">
                {errors.descricao.message}
              </p>
            )}
          </div>

          {/* Valor */}
          <div>
            <Label htmlFor="valor">
              Valor {recorrente ? "de cada parcela/mês" : ""}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                id="valor"
                type="text"
                placeholder="0,00"
                className="pl-8"
                value={valorFormatado}
                onChange={handleValorChange}
              />
            </div>
            {errors.valorFormatado && (
              <p className="text-sm text-red-500 mt-1">
                {errors.valorFormatado.message}
              </p>
            )}
          </div>

          {/* Tipo e Data */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select
                value={tipo}
                onValueChange={(value: "RECEITA" | "DESPESA") =>
                  setValue("tipo", value)
                }
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        tipo === "RECEITA" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={`${
                        tipo === "RECEITA"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {tipo === "RECEITA" ? "Receita" : "Despesa"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RECEITA">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-green-600 dark:text-green-400">
                        Receita
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="DESPESA">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-red-600 dark:text-red-400">
                        Despesa
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dataTransacao">
                Data {recorrente ? "da 1ª parcela" : ""}
              </Label>
              <Input
                id="dataTransacao"
                type="date"
                {...register("dataTransacao")}
              />
              {errors.dataTransacao && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.dataTransacao.message}
                </p>
              )}
            </div>
          </div>

          {/* Categoria */}
          <div>
            <Label>Categoria</Label>
            <Select
              value={categoriaId}
              onValueChange={(value) => setValue("categoriaId", value)}
              disabled={loadingCategorias}
            >
              <SelectTrigger>
                {categoriaSelecionada ? (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getCategoriaColor(
                        categoriaSelecionada
                      )}`}
                    ></div>
                    <span>{categoriaSelecionada.nome}</span>
                  </div>
                ) : (
                  <SelectValue
                    placeholder={
                      loadingCategorias
                        ? "Carregando categorias..."
                        : "Selecione uma categoria"
                    }
                  />
                )}
              </SelectTrigger>
              <SelectContent>
                {categoriasFiltradas.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getCategoriaColor(
                          categoria
                        )}`}
                      ></div>
                      <span>{categoria.nome}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoriaId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.categoriaId.message}
              </p>
            )}
          </div>

          {/* Recorrência Simplificada */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-blue-500" />
                <Label className="font-medium">É recorrente? (mensal)</Label>
              </div>
              <Switch
                checked={recorrente}
                onCheckedChange={(checked) => setValue("recorrente", checked)}
              />
            </div>

            {recorrente && (
              <div className="space-y-3">
                <div>
                  <Label>Quantas vezes?</Label>
                  <Select
                    value={quantidadeParcelas.toString()}
                    onValueChange={(value) =>
                      setValue("quantidadeParcelas", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione quantas vezes" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {opcoesQuantidade.map((quantidade) => (
                        <SelectItem
                          key={quantidade}
                          value={quantidade.toString()}
                        >
                          {quantidade}x{" "}
                          {quantidade <= 12
                            ? `(${quantidade} ${
                                quantidade === 1 ? "mês" : "meses"
                              })`
                            : `(${Math.round((quantidade / 12) * 10) / 10} ${
                                quantidade <= 12 ? "ano" : "anos"
                              })`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.quantidadeParcelas && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.quantidadeParcelas.message}
                    </p>
                  )}
                </div>

                {/* Preview da recorrência */}
                {quantidadeParcelas && parseCurrencyInput(valorFormatado) && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      <RefreshCw className="inline h-4 w-4 mr-1" />
                      {getExemploTexto(
                        recorrente,
                        quantidadeParcelas,
                        valorFormatado,
                        tipo
                      )}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Criará {quantidadeParcelas} transações mensais automáticas
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              placeholder="Informações adicionais..."
              rows={2}
              {...register("observacoes")}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEditing ? "Atualizar" : "Criar"}
              {recorrente && ` (${quantidadeParcelas}x)`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
