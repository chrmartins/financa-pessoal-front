import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores";
import { Plus } from "lucide-react";

export function DashboardHeader() {
  const { setCreateTransacaoOpen } = useModalStore();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Bem-vindo ao seu Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Acompanhe suas finanças em tempo real
        </p>
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
