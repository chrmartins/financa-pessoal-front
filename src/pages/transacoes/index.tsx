import { TransacaoModal } from "@/components/TransacaoModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTransacoes } from "../../hooks/queries/transacoes/use-transacoes";
import { TransacoesList } from "./components/TransacoesList";

export function Transacoes() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { data, isLoading } = useTransacoes({
    size: 100, // Buscar todas as transações na página
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Transações
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas receitas e despesas
          </p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Lista de transações */}
      <TransacoesList transacoes={data?.content || []} isLoading={isLoading} />

      {/* Modal para criar transação */}
      <TransacaoModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
