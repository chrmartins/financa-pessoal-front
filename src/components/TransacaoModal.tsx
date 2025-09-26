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
import type { CreateTransacaoRequest, TransacaoResponse } from "@/types";
import { formatCurrencyInput, parseCurrencyInput } from "@/utils";
import { CalendarDays, Clock, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TransacaoModalProps {
  open: boolean;
  onClose: () => void;
  transacao?: TransacaoResponse | null;
}

export function TransacaoModal({
  open,
  onClose,
  transacao,
}: TransacaoModalProps) {
  const isEditing = Boolean(transacao);

  // Estados do formulário
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number>(0);
  const [valorFormatado, setValorFormatado] = useState(""); // Novo estado para exibição
  const [dataTransacao, setDataTransacao] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [tipo, setTipo] = useState<"RECEITA" | "DESPESA">("DESPESA");
  const [categoriaId, setCategoriaId] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [recorrente, setRecorrente] = useState(false);
  const [quantidadeParcelas, setQuantidadeParcelas] = useState<number>(2);

  const { mutate: createTransacao, isPending: isCreating } = useTransacaoCreate(
    {
      onSuccess: (data) => {
        console.log("🎉 Modal: Transação criada com sucesso:", data);

        if (recorrente) {
          toast.success(
            `${quantidadeParcelas} transações recorrentes criadas com sucesso!`
          );
        } else {
          toast.success("Transação criada com sucesso!");
        }

        // Fechar modal após pequeno delay
        setTimeout(() => {
          console.log("🔒 Modal: Fechando modal");
          onClose();
        }, 500);
      },
      onError: (error) => {
        console.error("❌ Erro ao criar transação:", error);
        toast.error("Erro ao criar transação");
      },
    }
  );
  const { data: categorias = [], isLoading: loadingCategorias } =
    useCategoriasList();

  // Resetar formulário quando abrir/fechar modal
  useEffect(() => {
    if (open) {
      if (transacao) {
        setDescricao(transacao.descricao);
        setValor(transacao.valor);
        // Converter número de volta para string formatada
        const valorEmCents = Math.round(transacao.valor * 100).toString();
        setValorFormatado(formatCurrencyInput(valorEmCents));
        setDataTransacao(transacao.dataTransacao);
        setTipo(transacao.tipo);
        setCategoriaId(transacao.categoria.id);
        setObservacoes(transacao.observacoes || "");
        setRecorrente(transacao.recorrente || false);
        setQuantidadeParcelas(transacao.quantidadeParcelas || 2);
      } else {
        // Limpar formulário para nova transação
        setDescricao("");
        setValor(0);
        setValorFormatado("");
        setDataTransacao(new Date().toISOString().split("T")[0]);
        setTipo("DESPESA");
        setCategoriaId("");
        setObservacoes("");
        setRecorrente(false);
        setQuantidadeParcelas(2);
      }
    }
  }, [open, transacao]);

  // Função para formatar valor conforme usuário digita
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatCurrencyInput(inputValue);
    setValorFormatado(formatted);

    // Converter para número para armazenar no estado
    const numericValue = parseCurrencyInput(formatted);
    console.log(
      `💰 Valor formatado: "${formatted}" → Numérico: ${numericValue}`
    );
    setValor(numericValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Iniciando criação de transação:", {
      descricao,
      valor,
      recorrente,
      quantidadeParcelas: recorrente ? quantidadeParcelas : "N/A",
    });

    // Validações básicas
    if (!descricao.trim()) {
      toast.error("Descrição é obrigatória");
      return;
    }

    // Validação aprimorada do valor
    const valorNumerico = Number(valor);
    if (!valorNumerico || valorNumerico <= 0 || isNaN(valorNumerico)) {
      toast.error("Valor deve ser um número maior que zero");
      console.log("❌ Valor inválido:", {
        valor,
        valorNumerico,
        isNaN: isNaN(valorNumerico),
      });
      return;
    }

    if (!categoriaId) {
      toast.error("Selecione uma categoria");
      return;
    }
    if (recorrente && quantidadeParcelas < 2) {
      toast.error("Para transações recorrentes, defina pelo menos 2 parcelas");
      return;
    }

    const requestData: CreateTransacaoRequest = {
      descricao,
      valor: valorNumerico, // Garantir que seja número
      dataTransacao,
      tipo,
      categoriaId, // Manter como string (UUID)
      observacoes,
      recorrente,
      quantidadeParcelas: recorrente ? quantidadeParcelas : undefined,
      tipoRecorrencia: recorrente ? "MENSAL" : undefined,
      valorTotalOriginal: recorrente
        ? valorNumerico * quantidadeParcelas
        : undefined,
    };

    console.log("📦 Dados sendo enviados para API:", requestData);

    createTransacao(requestData);
  };

  // Opções de quantidade de recorrências
  const opcoesQuantidade = [
    ...Array.from({ length: 23 }, (_, i) => i + 2), // 2 a 24
    30,
    36,
    48,
    60, // Opções extras para financiamentos
  ];

  // Função para gerar cor baseada no nome da categoria
  const getCategoriaColor = (categoria: any) => {
    if (categoria.cor) {
      return categoria.cor;
    }

    // Cores predefinidas baseadas no nome
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-red-500",
      "bg-cyan-500",
      "bg-emerald-500",
      "bg-violet-500",
    ];

    // Gerar índice baseado no hash do nome
    const hash = categoria.nome
      .split("")
      .reduce(
        (acc: number, char: string) => char.charCodeAt(0) + ((acc << 5) - acc),
        0
      );

    return colors[Math.abs(hash) % colors.length];
  };

  // Encontrar categoria selecionada
  const categoriaSelecionada = categorias.find((c) => c.id === categoriaId);

  const getExemploTexto = () => {
    if (!recorrente || !quantidadeParcelas || !valor) return "";

    const totalValue = valor * quantidadeParcelas;
    const tipoTexto = tipo === "RECEITA" ? "receita" : "despesa";

    return `${quantidadeParcelas}x ${tipoTexto}s mensais de ${valor.toLocaleString(
      "pt-BR",
      { style: "currency", currency: "BRL" }
    )} = ${totalValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })} total`;
  };

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
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
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
          </div>

          {/* Tipo e Data */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select
                value={tipo}
                onValueChange={(value: "RECEITA" | "DESPESA") => setTipo(value)}
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
                value={dataTransacao}
                onChange={(e) => setDataTransacao(e.target.value)}
              />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <Label>Categoria</Label>
            <Select
              value={categoriaId}
              onValueChange={setCategoriaId}
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
                {categorias.map((categoria) => (
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
          </div>

          {/* Recorrência Simplificada */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-blue-500" />
                <Label className="font-medium">É recorrente? (mensal)</Label>
              </div>
              <Switch checked={recorrente} onCheckedChange={setRecorrente} />
            </div>

            {recorrente && (
              <div className="space-y-3">
                <div>
                  <Label>Quantas vezes?</Label>
                  <Select
                    value={quantidadeParcelas.toString()}
                    onValueChange={(value) =>
                      setQuantidadeParcelas(Number(value))
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
                </div>

                {/* Preview da recorrência */}
                {quantidadeParcelas && valor && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      <RefreshCw className="inline h-4 w-4 mr-1" />
                      {getExemploTexto()}
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
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
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
