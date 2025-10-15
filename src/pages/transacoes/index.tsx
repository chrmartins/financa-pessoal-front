import { Button } from "@/components/ui/button";
import { useMonthSelector } from "@/hooks/use-month-selector";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo } from "react";
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

  // Combinar transações reais + preview (remover duplicatas)
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

      {/* Lista de transações */}
      <TransacoesList transacoes={transacoesOrdenadas} isLoading={isLoading} />
    </div>
  );
}
