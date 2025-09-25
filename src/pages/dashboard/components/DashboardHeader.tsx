import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useModalStore } from "@/stores/modals/use-modal-store";
import { ChevronLeft, ChevronRight, Plus, RotateCcw } from "lucide-react";

interface DashboardHeaderProps {
  formattedMonth: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onCurrentMonth: () => void;
  isCurrentMonth: boolean;
  isLoadingMonth?: boolean;
}

export function DashboardHeader({
  formattedMonth,
  onPreviousMonth,
  onNextMonth,
  onCurrentMonth,
  isCurrentMonth,
  isLoadingMonth = false,
}: DashboardHeaderProps) {
  const { setCreateTransacaoOpen } = useModalStore();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Resumo Financeiro
        </h2>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onPreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[140px] text-center">
                {formattedMonth}
              </span>
              {isLoadingMonth && <Spinner size="sm" />}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {!isCurrentMonth && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs px-2"
              onClick={onCurrentMonth}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Atual
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          variant="gradient"
          className="flex-1 sm:flex-none"
          onClick={() => setCreateTransacaoOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
      </div>
    </div>
  );
}
