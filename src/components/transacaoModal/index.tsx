import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useTransacaoUpdate } from "@/hooks/queries/transacoes/use-transacao-update";
import { CategoriaFormModal } from "@/pages/categorias/components/CategoriaFormModal";
import type { CreateTransacaoRequest } from "@/types";
import { formatCurrencyInput, parseCurrencyInput } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Clock, Loader2, Plus, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { TransacaoModalProps } from "./interface";
import { getExemploTexto, opcoesQuantidade } from "./utils";
import { formSchema, type FormData } from "./validations";

export function TransacaoModal({
  open,
  onClose,
  transacao,
}: TransacaoModalProps) {
  const isEditing = Boolean(transacao);
  const successHandledRef = useRef(false);
  const [categoriaModalOpen, setCategoriaModalOpen] = useState(false);
  const [novaCategoriaCriada, setNovaCategoriaCriada] = useState<string | null>(
    null
  );

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

  const {
    mutate: createTransacao,
    isPending: isCreating,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
    error: createError,
    reset: resetCreateMutation,
  } = useTransacaoCreate();

  const {
    mutate: updateTransacao,
    isPending: isUpdating,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError,
    reset: resetUpdateMutation,
  } = useTransacaoUpdate();

  const isPending = isCreating || isUpdating;
  const isSuccess = isCreateSuccess || isUpdateSuccess;
  const isError = isCreateError || isUpdateError;
  const error = createError || updateError;
  const resetMutation = () => {
    resetCreateMutation();
    resetUpdateMutation();
  };

  useEffect(() => {
    if (isSuccess && !successHandledRef.current) {
      successHandledRef.current = true;
      toast.success(
        isEditing
          ? "Transação atualizada com sucesso!"
          : "Transação criada com sucesso!"
      );

      // Pequeno delay para garantir que as queries foram invalidadas
      setTimeout(() => {
        resetMutation(); // Resetar mutation antes de fechar
        successHandledRef.current = false;
        onClose();
      }, 300);
    }
  }, [isSuccess, isEditing, onClose, resetMutation]);

  useEffect(() => {
    if (isError && error) {
      toast.error(
        error?.message || "Erro ao processar transação. Tente novamente."
      );
    }
  }, [isError, error]);

  const { data: categorias = [], isLoading: loadingCategorias } =
    useCategoriasList();

  const categoriasFiltradas = categorias.filter(
    (categoria) => categoria.tipo === tipo && categoria.ativa
  );

  // Selecionar automaticamente a nova categoria criada
  useEffect(() => {
    if (novaCategoriaCriada && categorias.length > 0) {
      const categoriaEncontrada = categorias.find(
        (c) => c.id === novaCategoriaCriada && c.tipo === tipo
      );

      if (categoriaEncontrada) {
        setValue("categoriaId", novaCategoriaCriada);
        setNovaCategoriaCriada(null);
        toast.success(`Categoria "${categoriaEncontrada.nome}" selecionada!`);
      }
    }
  }, [novaCategoriaCriada, categorias, tipo, setValue]);
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
      resetMutation();
      successHandledRef.current = false;

      if (transacao) {
        // Converter valor de reais para centavos e formatar
        const valorEmCentavos = Math.round(transacao.valor * 100);
        const valorFormatado = formatCurrencyInput(valorEmCentavos.toString());

        reset({
          descricao: transacao.descricao || "",
          valorFormatado: valorFormatado,
          dataTransacao:
            transacao.dataTransacao || new Date().toISOString().split("T")[0],
          tipo: transacao.tipo || "DESPESA",
          categoriaId: transacao.categoria?.id || "",
          observacoes: transacao.observacoes || "",
          recorrente: false, // Sempre false ao editar
          quantidadeParcelas: 2,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, transacao?.id]);

  // Função para formatar valor conforme usuário digita
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatCurrencyInput(inputValue);
    setValue("valorFormatado", formatted);
  };

  const handleSubmit = onSubmit((data: FormData) => {
    const valorNumerico = parseCurrencyInput(data.valorFormatado);

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
      recorrente: isEditing ? false : data.recorrente,
      quantidadeParcelas:
        !isEditing && data.recorrente ? data.quantidadeParcelas : undefined,
      tipoRecorrencia: !isEditing && data.recorrente ? "MENSAL" : undefined,
      valorTotalOriginal:
        !isEditing && data.recorrente
          ? valorNumerico * data.quantidadeParcelas
          : undefined,
    };

    if (isEditing && transacao?.id) {
      // Atualizar transação existente
      updateTransacao({ id: transacao.id, data: requestData });
    } else {
      // Criar nova transação
      createTransacao(requestData);
    }
  });

  const categoriaId = watch("categoriaId");

  const categoriaSelecionada = categorias.find((c) => c.id === categoriaId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
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
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da transação selecionada."
              : "Registre uma nova receita ou despesa para controlar suas finanças."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 overflow-y-auto flex-1 pr-2"
        >
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
              value={categoriaId === "_create_new" ? "" : categoriaId}
              onValueChange={(value) => {
                if (value === "_create_new") {
                  setCategoriaModalOpen(true);
                } else {
                  setValue("categoriaId", value);
                }
              }}
              disabled={loadingCategorias}
            >
              <SelectTrigger>
                {categoriaSelecionada ? (
                  <div className="flex items-center gap-2">
                    {categoriaSelecionada.cor && (
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: categoriaSelecionada.cor,
                        }}
                      />
                    )}
                    <span>{categoriaSelecionada.nome}</span>
                  </div>
                ) : (
                  <SelectValue
                    placeholder={
                      loadingCategorias
                        ? "Carregando categorias..."
                        : categoriasFiltradas.length === 0
                        ? "Nenhuma categoria disponível"
                        : "Selecione uma categoria"
                    }
                  />
                )}
              </SelectTrigger>
              <SelectContent>
                {categoriasFiltradas.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    <div className="flex items-center gap-2">
                      {categoria.cor && (
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: categoria.cor,
                          }}
                        />
                      )}
                      <span>{categoria.nome}</span>
                    </div>
                  </SelectItem>
                ))}
                <SelectItem
                  value="_create_new"
                  className="text-primary font-medium border-t mt-1 pt-2"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>
                      Nova categoria de{" "}
                      {tipo === "RECEITA" ? "receita" : "despesa"}
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.categoriaId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.categoriaId.message}
              </p>
            )}
            {categoriasFiltradas.length === 0 && !loadingCategorias && (
              <p className="text-xs text-muted-foreground mt-1">
                💡 Crie sua primeira categoria de{" "}
                {tipo === "RECEITA" ? "receita" : "despesa"} clicando acima
              </p>
            )}
          </div>

          {/* Recorrência Simplificada */}
          {!isEditing && (
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
                        Criará {quantidadeParcelas} transações mensais
                        automáticas
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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
          <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-background border-t mt-4 -mx-2 px-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isEditing ? "Atualizar" : "Criar"}
              {recorrente && ` (${quantidadeParcelas}x)`}
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* Modal de criação de categoria */}
      <CategoriaFormModal
        open={categoriaModalOpen}
        onClose={(categoriaCriadaId?: string) => {
          setCategoriaModalOpen(false);
          if (categoriaCriadaId) {
            setNovaCategoriaCriada(categoriaCriadaId);
          }
        }}
        categoria={
          tipo
            ? {
                id: "",
                nome: "",
                descricao: "",
                tipo: tipo,
                cor: "",
                ativa: true,
                usuarioId: "",
                dataCriacao: "",
                dataAtualizacao: "",
              }
            : null
        }
      />
    </Dialog>
  );
}
