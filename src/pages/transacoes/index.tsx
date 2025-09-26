import { TransacaoModal } from "@/components/transacaoModal";
import { Button } from "@/components/ui/button";
import { useMonthSelector } from "@/hooks/use-month-selector";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { useTransacoesList } from "../../hooks/queries/transacoes/use-transacoes-list";
import { TransacoesList } from "./components/TransacoesList";

export function Transacoes() {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Hook para gerenciar seleção de mês
  const {
    dataInicio,
    dataFim,
    formattedMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    isCurrentMonth,
  } = useMonthSelector();

  // Buscar transações do mês selecionado
  const { data, isLoading } = useTransacoesList({
    dataInicio,
    dataFim,
    size: 1000, // Buscar todas as transações do mês
  });

  // Transações já vêm ordenadas do serviço (mais recente primeiro)
  const transacoesOrdenadas = data?.content || [];

  return (
    <div className="space-y-6">
      {/* Cabeçalho com seletor de mês */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
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
          onClick={() => setCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Lista de transações */}
      <TransacoesList transacoes={transacoesOrdenadas} isLoading={isLoading} />

      {/* Modal para criar transação */}
      <TransacaoModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
