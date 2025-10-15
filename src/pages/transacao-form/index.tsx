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
import { Textarea } from "@/components/ui/textarea";
import { useCategoriasList } from "@/hooks/queries/categorias/use-categorias-list";
import { useTransacaoCreate } from "@/hooks/queries/transacoes/use-transacao-create";
import { useTransacaoDetail } from "@/hooks/queries/transacoes/use-transacao-detail";
import { useTransacaoUpdate } from "@/hooks/queries/transacoes/use-transacao-update";
import { CategoriaFormModal } from "@/pages/categorias/components/CategoriaFormModal";
import type { CreateTransacaoRequest, UpdateTransacaoRequest } from "@/types";
import { formatCurrencyInput, parseCurrencyInput } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Plus,
  RefreshCw,
  Save,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

// Schema de validação
const formSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valorFormatado: z.string().min(1, "Valor é obrigatório"),
  dataTransacao: z.string().min(1, "Data é obrigatória"),
  tipo: z.enum(["RECEITA", "DESPESA"]),
  categoriaId: z.string().min(1, "Categoria é obrigatória"),
  observacoes: z.string().optional(),
  recorrente: z.boolean(),
  tipoRecorrencia: z.enum(["PARCELADA", "FIXA"]).optional(),
  quantidadeParcelas: z.number().min(2).max(60).optional(),
  frequencia: z
    .enum(["MENSAL"]) // ✅ Apenas MENSAL por enquanto
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

export function TransacaoFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const successHandledRef = useRef(false);
  const [categoriaModalOpen, setCategoriaModalOpen] = useState(false);
  const [novaCategoriaCriada, setNovaCategoriaCriada] = useState<string | null>(
    null
  );

  // ✅ Estados para controlar modal de confirmação de edição
  const [showEditModal, setShowEditModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const [escopoEdicao, setEscopoEdicao] = useState<
    "APENAS_ESTA" | "DESTA_DATA_EM_DIANTE" | "TODAS"
  >("APENAS_ESTA");

  // Buscar transação se estiver editando
  const { data: transacao, isLoading: loadingTransacao } = useTransacaoDetail(
    id || ""
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
      tipoRecorrencia: "PARCELADA",
      quantidadeParcelas: 2,
      frequencia: "MENSAL",
    },
  });

  const recorrente = watch("recorrente");
  const tipoRecorrencia = watch("tipoRecorrencia");
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

  // Preencher formulário ao carregar transação para edição
  useEffect(() => {
    if (transacao && isEditing) {
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
        // ✅ Carregar campos de recorrência
        recorrente: transacao.recorrente || false,
        tipoRecorrencia: transacao.tipoRecorrencia || "PARCELADA",
        quantidadeParcelas: transacao.quantidadeParcelas || 2,
        // ✅ Sempre MENSAL para transações FIXA
        frequencia: "MENSAL",
      });
    }
  }, [transacao, isEditing, reset]);

  useEffect(() => {
    if (isSuccess && !successHandledRef.current) {
      successHandledRef.current = true;
      toast.success(
        isEditing
          ? "Transação atualizada com sucesso!"
          : "Transação criada com sucesso!"
      );

      setTimeout(() => {
        resetMutation();
        successHandledRef.current = false;
        navigate("/transacoes");
      }, 300);
    }
  }, [isSuccess, isEditing, navigate, resetMutation]);

  useEffect(() => {
    if (isError && error) {
      toast.error(
        error?.message ||
          `Erro ao ${
            isEditing ? "atualizar" : "criar"
          } transação. Tente novamente.`
      );
    }
  }, [isError, error, isEditing]);

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

  // ✅ Garantir que transações FIXA sempre tenham frequência MENSAL
  useEffect(() => {
    if (recorrente && tipoRecorrencia === "FIXA") {
      setValue("frequencia", "MENSAL");
    }
  }, [recorrente, tipoRecorrencia, setValue]);

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatCurrencyInput(inputValue);
    setValue("valorFormatado", formatted);
  };

  const handleSubmit = (data: FormData) => {
    const valorEmCentavos = parseCurrencyInput(data.valorFormatado);

    if (valorEmCentavos <= 0) {
      toast.error("O valor deve ser maior que zero");
      return;
    }

    // ✅ Se está editando uma transação FIXA, mostrar modal de confirmação
    if (
      isEditing &&
      transacao?.recorrente &&
      transacao?.tipoRecorrencia === "FIXA"
    ) {
      setPendingFormData(data);
      setShowEditModal(true);
      return;
    }

    // ✅ Transformação de ÚNICA → FIXA também precisa de confirmação
    if (
      isEditing &&
      !transacao?.recorrente &&
      data.recorrente &&
      data.tipoRecorrencia === "FIXA"
    ) {
      setPendingFormData(data);
      setShowEditModal(true);
      return;
    }

    // Caso normal: criar ou editar sem confirmação
    submitTransacao(data);
  };

  const submitTransacao = (
    data: FormData,
    escopo?: "APENAS_ESTA" | "DESTA_DATA_EM_DIANTE" | "TODAS"
  ) => {
    const valorEmCentavos = parseCurrencyInput(data.valorFormatado);

    const transacaoData: CreateTransacaoRequest | UpdateTransacaoRequest = {
      descricao: data.descricao,
      valor: valorEmCentavos,
      dataTransacao: data.dataTransacao,
      tipo: data.tipo,
      categoriaId: data.categoriaId,
      observacoes: data.observacoes || undefined,
      recorrente: data.recorrente,
      tipoRecorrencia: data.recorrente ? data.tipoRecorrencia : undefined,
      quantidadeParcelas:
        data.recorrente && data.tipoRecorrencia === "PARCELADA"
          ? data.quantidadeParcelas
          : undefined,
      frequencia:
        data.recorrente && data.tipoRecorrencia === "FIXA"
          ? data.frequencia
          : undefined,
    };

    if (isEditing && id) {
      // ✅ Adiciona escopo de edição para transações FIXA
      const updateData: UpdateTransacaoRequest = {
        ...transacaoData,
        escopoEdicao: escopo,
      };
      updateTransacao({ id, data: updateData });
    } else {
      createTransacao(transacaoData as CreateTransacaoRequest);
    }
  };

  const handleConfirmEdit = () => {
    if (pendingFormData) {
      submitTransacao(pendingFormData, escopoEdicao);
      setShowEditModal(false);
      setPendingFormData(null);
    }
  };

  const handleCancelar = () => {
    navigate("/transacoes");
  };

  // Loading state
  if (loadingTransacao) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600 dark:text-slate-400">
            Carregando transação...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancelar}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? "Editar Transação" : "Nova Transação"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
              {isEditing
                ? "Atualize os campos abaixo para modificar a transação"
                : "Preencha os campos abaixo para adicionar uma transação"}
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={onSubmit(handleSubmit)} className="space-y-6">
          {/* Card principal */}
          <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-6">
            {/* Tipo de transação */}
            <div className="space-y-2">
              <Label>Tipo de Transação</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={tipo === "DESPESA" ? "default" : "outline"}
                  className={`h-12 ${
                    tipo === "DESPESA"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                  onClick={() => setValue("tipo", "DESPESA")}
                >
                  💸 Despesa
                </Button>
                <Button
                  type="button"
                  variant={tipo === "RECEITA" ? "default" : "outline"}
                  className={`h-12 ${
                    tipo === "RECEITA"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                  onClick={() => setValue("tipo", "RECEITA")}
                >
                  💰 Receita
                </Button>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Input
                id="descricao"
                placeholder="Ex: Almoço no restaurante"
                {...register("descricao")}
                className={errors.descricao ? "border-red-500" : ""}
              />
              {errors.descricao && (
                <p className="text-sm text-red-500">
                  {errors.descricao.message}
                </p>
              )}
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="valor">
                Valor <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400">
                  R$
                </span>
                <Input
                  id="valor"
                  placeholder="0,00"
                  value={valorFormatado}
                  onChange={handleValorChange}
                  className={`pl-12 ${
                    errors.valorFormatado ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.valorFormatado && (
                <p className="text-sm text-red-500">
                  {errors.valorFormatado.message}
                </p>
              )}
            </div>

            {/* Data */}
            <div className="space-y-2">
              <Label htmlFor="data">
                Data <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-slate-400" />
                <Input
                  id="data"
                  type="date"
                  {...register("dataTransacao")}
                  className={`pl-10 ${
                    errors.dataTransacao ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.dataTransacao && (
                <p className="text-sm text-red-500">
                  {errors.dataTransacao.message}
                </p>
              )}
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="categoria">
                  Categoria <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCategoriaModalOpen(true)}
                  className="h-8 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Nova
                </Button>
              </div>

              <Select
                value={watch("categoriaId")}
                onValueChange={(value) => setValue("categoriaId", value)}
              >
                <SelectTrigger
                  className={errors.categoriaId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {loadingCategorias ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Carregando...
                      </div>
                    </SelectItem>
                  ) : categoriasFiltradas.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Nenhuma categoria encontrada
                    </SelectItem>
                  ) : (
                    categoriasFiltradas.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id}>
                        {categoria.icone} {categoria.nome}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.categoriaId && (
                <p className="text-sm text-red-500">
                  {errors.categoriaId.message}
                </p>
              )}
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Textarea
                id="observacoes"
                placeholder="Adicione detalhes sobre esta transação..."
                rows={3}
                {...register("observacoes")}
              />
            </div>
          </div>

          {/* Card de recorrência */}
          <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-4">
            {/* Switch principal */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-blue-600" />
                  <Label htmlFor="recorrente" className="cursor-pointer">
                    Transação Recorrente
                  </Label>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Criar múltiplas transações automáticas
                </p>
              </div>
              <Switch
                checked={recorrente}
                onCheckedChange={(checked) => {
                  setValue("recorrente", checked);
                  if (!checked) {
                    setValue("tipoRecorrencia", "PARCELADA");
                    setValue("quantidadeParcelas", 2);
                    setValue("frequencia", "MENSAL");
                  }
                }}
              />
            </div>

            {recorrente && (
              <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                {/* Tipo de Recorrência */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Tipo de Recorrência
                  </Label>

                  <div className="space-y-2">
                    {/* Opção: Parcelada */}
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        tipoRecorrencia === "PARCELADA"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                      onClick={() => setValue("tipoRecorrencia", "PARCELADA")}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {tipoRecorrencia === "PARCELADA" ? (
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              📦 Parcelada em X vezes
                            </p>
                            <p className="text-sm text-gray-600 dark:text-slate-400">
                              Para compras parceladas, empréstimos, etc.
                            </p>
                          </div>

                          {tipoRecorrencia === "PARCELADA" && (
                            <div className="space-y-2 pt-2">
                              <Label className="text-xs">
                                Quantidade de parcelas
                              </Label>
                              <Select
                                value={String(quantidadeParcelas)}
                                onValueChange={(value) =>
                                  setValue("quantidadeParcelas", Number(value))
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from(
                                    { length: 59 },
                                    (_, i) => i + 2
                                  ).map((num) => (
                                    <SelectItem key={num} value={String(num)}>
                                      {num}x parcelas
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 mt-2">
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                  💡 Criará {quantidadeParcelas}{" "}
                                  {tipo === "RECEITA" ? "receitas" : "despesas"}{" "}
                                  mensais consecutivas
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Opção: Fixa */}
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        tipoRecorrencia === "FIXA"
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                      onClick={() => setValue("tipoRecorrencia", "FIXA")}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {tipoRecorrencia === "FIXA" ? (
                            <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              🔄 Fixa (sem data de término)
                            </p>
                            <p className="text-sm text-gray-600 dark:text-slate-400">
                              Para salário, aluguel, assinaturas, contas
                              mensais, etc.
                            </p>
                          </div>

                          {tipoRecorrencia === "FIXA" && (
                            <div className="space-y-2 pt-2">
                              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3">
                                <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                                  📊 Frequência: MENSAL
                                </p>
                                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                  ♾️ Criará transações mensais indefinidamente
                                  até você cancelar
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelar}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || (isEditing && !transacao)}
              className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? "Atualizando..." : "Salvando..."}
                </>
              ) : (
                <>
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Atualizar Transação
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Transação
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Modal de nova categoria */}
      <CategoriaFormModal
        open={categoriaModalOpen}
        onClose={(categoriaCriadaId) => {
          if (categoriaCriadaId) {
            setNovaCategoriaCriada(categoriaCriadaId);
          }
          setCategoriaModalOpen(false);
        }}
        categoria={{ tipo } as any}
      />

      {/* ✅ Modal de confirmação de edição de transação FIXA */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              Editar Transação Recorrente
            </DialogTitle>
            <DialogDescription>
              Esta é uma transação recorrente do tipo FIXA. Como você deseja
              aplicar as alterações?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="radio"
                  name="escopo"
                  value="APENAS_ESTA"
                  checked={escopoEdicao === "APENAS_ESTA"}
                  onChange={(e) => setEscopoEdicao(e.target.value as any)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    Apenas esta ocorrência
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Esta transação será desvinculada da recorrência e se tornará
                    única
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="radio"
                  name="escopo"
                  value="DESTA_DATA_EM_DIANTE"
                  checked={escopoEdicao === "DESTA_DATA_EM_DIANTE"}
                  onChange={(e) => setEscopoEdicao(e.target.value as any)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    Desta data em diante
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Atualiza esta transação e todas as futuras, deletando as
                    antigas futuras
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="radio"
                  name="escopo"
                  value="TODAS"
                  checked={escopoEdicao === "TODAS"}
                  onChange={(e) => setEscopoEdicao(e.target.value as any)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    Todas as ocorrências
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Atualiza a transação original e todas as suas ocorrências
                    (passado e futuro)
                  </div>
                </div>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setPendingFormData(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmEdit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Confirmar Alteração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
