import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/modals/use-modal-store";
import { Plus } from "lucide-react";

export function DashboardHeader() {
  const { setCreateTransacaoOpen } = useModalStore();

  return (
    <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
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
