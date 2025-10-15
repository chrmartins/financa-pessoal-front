import { Button } from "@/components/ui/button";
import { useMonthSelector } from "@/hooks/use-month-selector";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTransacoesList } from "../../hooks/queries/transacoes/use-transacoes-list";
import { useTransacoesPreview } from "../../hooks/queries/transacoes/use-transacoes-preview";
import { TransacoesList } from "./components/TransacoesList";

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

  // Combinar transações reais + preview (remover duplicatas)
  const transacoesOrdenadas = useMemo(() => {
    const transacoesReais = data?.content || [];
    const transacoesPreview = previewData || [];

    // Se não há preview, retorna apenas as reais
    if (transacoesPreview.length === 0) {
      return transacoesReais;
    }

    // Combinar: transações reais + previews (apenas as que não existem no banco)
    const idsReais = new Set(transacoesReais.map((t) => t.id));
    const previewsFiltradas = transacoesPreview.filter(
      (t) => !t.id || !idsReais.has(t.id)
    );

    const combinadas = [...transacoesReais, ...previewsFiltradas];

    // Ordenar por data (mais recente primeiro)
    return combinadas.sort((a, b) => {
      const dateA = new Date(a.dataTransacao).getTime();
      const dateB = new Date(b.dataTransacao).getTime();
      return dateB - dateA;
    });
  }, [data?.content, previewData]);

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
