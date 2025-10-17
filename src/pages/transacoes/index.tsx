import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMonthSelector } from "@/hooks/use-month-selector";
import { ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTransacoesList } from "../../hooks/queries/transacoes/use-transacoes-list";
import { useTransacoesPreview } from "../../hooks/queries/transacoes/use-transacoes-preview";
import { TransacoesList } from "./components/TransacoesList";

/**
 * Verifica se o mês/ano está APÓS 12 meses do mês atual
 * (mesma lógica do hook, para garantir consistência)
 * @param mes - Mês no formato 0-11 (JavaScript Date)
 * @param ano - Ano completo (ex: 2025)
 */
function shouldShowPreview(mes: number, ano: number): boolean {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth(); // 0-11

  // mes já vem como 0-11 (selectedMonth), usar direto
  const dataAlvo = new Date(ano, mes, 1);
  const dataLimite12Meses = new Date(anoAtual, mesAtual + 12, 1);

  return dataAlvo >= dataLimite12Meses;
}

export function Transacoes() {
  const navigate = useNavigate();

  // Estados de busca e filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<"TODOS" | "RECEITA" | "DESPESA">(
    "TODOS"
  );

  // Hook para gerenciar seleção de mês
  const {
    dataInicio,
    dataFim,
    formattedMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    isCurrentMonth,
    selectedMonth,
    selectedYear,
  } = useMonthSelector();

  // Buscar transações do mês selecionado (dados reais do banco)
  const { data, isLoading: isLoadingReal } = useTransacoesList({
    dataInicio,
    dataFim,
    size: 1000, // Buscar todas as transações do mês
  });

  // Buscar preview de transações FIXA futuras (apenas para meses distantes)
  // selectedMonth é 0-11, mas API espera 1-12
  const { data: previewData, isLoading: isLoadingPreview } =
    useTransacoesPreview(selectedMonth + 1, selectedYear);

  // Verificar se devemos mostrar preview neste mês
  const deveExibirPreview = shouldShowPreview(selectedMonth, selectedYear);

  // Combinar transações reais + preview (remover duplicatas) e aplicar filtros
  const transacoesOrdenadas = useMemo(() => {
    const transacoesReais = data?.content || [];

    // PROTEÇÃO: Só usa preview se estiver no período correto (12+ meses)
    const transacoesPreview = (deveExibirPreview ? previewData : []) || [];

    // Se não há preview, retorna apenas as reais
    if (transacoesPreview.length === 0) {
      return transacoesReais;
    }

    // Combinar: transações reais + previews (apenas as que não existem no banco)
    // Previews têm id === null, então não haverá conflito com IDs reais
    const idsReais = new Set(
      transacoesReais
        .filter((t) => t.id != null) // Garantir que só IDs válidos entram no Set
        .map((t) => t.id)
    );

    // Filtrar previews: só adiciona se não existir transação real com mesmo ID
    // Como previews têm id=null, precisamos também verificar por descrição+valor+data
    const previewsFiltradas = transacoesPreview.filter((preview) => {
      // Se preview tem ID (não deveria), verificar se não existe no banco
      if (preview.id && idsReais.has(preview.id)) {
        return false;
      }

      // Verificar duplicação por descrição + valor + data (mesma transação)
      const previewKey = `${preview.descricao}-${preview.valor}-${preview.dataTransacao}`;
      const existeReal = transacoesReais.some((real) => {
        const realKey = `${real.descricao}-${real.valor}-${real.dataTransacao}`;
        return realKey === previewKey;
      });

      return !existeReal;
    });

    const combinadas = [...transacoesReais, ...previewsFiltradas];

    // Ordenar por data (mais recente primeiro)
    return combinadas.sort((a, b) => {
      const dateA = new Date(a.dataTransacao).getTime();
      const dateB = new Date(b.dataTransacao).getTime();
      return dateB - dateA;
    });
  }, [data?.content, previewData, deveExibirPreview]);

  // Aplicar filtros de busca e tipo
  const transacoesFiltradas = useMemo(() => {
    let resultado = transacoesOrdenadas;

    // Filtro de busca por texto (descrição, categoria ou observações)
    if (searchTerm.trim()) {
      const termoBusca = searchTerm.toLowerCase().trim();
      resultado = resultado.filter((t) => {
        const descricao = t.descricao?.toLowerCase() || "";
        const categoria = t.categoria?.nome?.toLowerCase() || "";
        const observacoes = t.observacoes?.toLowerCase() || "";

        // Busca também por valor formatado (ex: "100" encontra "R$ 100,00")
        const valorString = t.valor.toString();

        return (
          descricao.includes(termoBusca) ||
          categoria.includes(termoBusca) ||
          observacoes.includes(termoBusca) ||
          valorString.includes(termoBusca)
        );
      });
    }

    // Filtro por tipo (RECEITA/DESPESA)
    if (tipoFiltro !== "TODOS") {
      resultado = resultado.filter((t) => t.tipo === tipoFiltro);
    }

    return resultado;
  }, [transacoesOrdenadas, searchTerm, tipoFiltro]);

  // Função para limpar todos os filtros
  const limparFiltros = () => {
    setSearchTerm("");
    setTipoFiltro("TODOS");
  };

  const temFiltrosAtivos = searchTerm || tipoFiltro !== "TODOS";
  const isLoading = isLoadingReal || isLoadingPreview;

  return (
    <div className="space-y-6">
      {/* Cabeçalho com seletor de mês */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Seletor de mês */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-center min-w-[140px]">
              <h2 className="text-lg font-semibold text-foreground">
                {formattedMonth}
              </h2>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Botão mês atual */}
          {!isCurrentMonth && (
            <Button
              variant="ghost"
              size="sm"
              onClick={goToCurrentMonth}
              className="text-muted-foreground hover:text-foreground"
            >
              Mês atual
            </Button>
          )}
        </div>

        {/* Botão nova transação */}
        <Button
          onClick={() => navigate("/transacoes/nova")}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Barra de busca e filtros */}
      <div className="space-y-4">
        {/* Busca por texto */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Buscar por descrição ou categoria..."
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
          {/* Filtro por tipo */}
          <Select
            value={tipoFiltro}
            onValueChange={(value: any) => setTipoFiltro(value)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue>
                {tipoFiltro === "RECEITA" && "💰 Receitas"}
                {tipoFiltro === "DESPESA" && "💸 Despesas"}
                {tipoFiltro === "TODOS" && "Todos os tipos"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos os tipos</SelectItem>
              <SelectItem value="RECEITA">💰 Receitas</SelectItem>
              <SelectItem value="DESPESA">💸 Despesas</SelectItem>
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
            {transacoesFiltradas.length === 0 ? (
              <span>Nenhuma transação encontrada com os filtros aplicados</span>
            ) : (
              <span>
                {transacoesFiltradas.length}{" "}
                {transacoesFiltradas.length === 1
                  ? "transação encontrada"
                  : "transações encontradas"}
                {transacoesOrdenadas.length > transacoesFiltradas.length &&
                  ` de ${transacoesOrdenadas.length} no total`}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Lista de transações */}
      <TransacoesList transacoes={transacoesFiltradas} isLoading={isLoading} />
    </div>
  );
}
