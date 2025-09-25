import { TransacaoModal } from "@/components/TransacaoModal";
import { useModalStore } from "@/stores";
import { useTransacoes } from "../../hooks/queries/transacoes/use-transacoes";
import { DashboardHeader } from "./components/DashboardHeader";
import { RecentTransactions } from "./components/RecentTransactions";
import { SummaryCards } from "./components/SummaryCards";
import { TrendChart } from "./components/TrendChart";

export function Dashboard() {
  const { createTransacaoOpen, setCreateTransacaoOpen } = useModalStore();
  const {
    data: transacoesPaginated,
    isLoading,
    error,
  } = useTransacoes({
    page: 0,
    size: 5,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Carregando...</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Erro ao carregar transações: {error.message}
      </div>
    );
  }

  const transacoes = transacoesPaginated?.content || [];

  const totalReceitas = transacoes
    .filter((t: any) => t.tipo === "RECEITA")
    .reduce((sum: number, t: any) => sum + t.valor, 0);

  const totalDespesas = transacoes
    .filter((t: any) => t.tipo === "DESPESA")
    .reduce((sum: number, t: any) => sum + t.valor, 0);

  const saldo = totalReceitas - totalDespesas;

  const resumoData = {
    saldo: saldo,
    receitas: totalReceitas,
    despesas: totalDespesas,
    economias: saldo > 0 ? saldo * 0.3 : 0, // 30% do saldo como economia
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader />

      {/* Cards de Resumo */}
      <SummaryCards data={resumoData} />

      {/* Gráfico de Tendência e Transações Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico Placeholder */}
        <TrendChart />

        {/* Transações Recentes */}
        <RecentTransactions transacoes={transacoes} isLoading={isLoading} />
      </div>

      {/* Modal de Nova Transação */}
      <TransacaoModal
        open={createTransacaoOpen}
        onClose={() => setCreateTransacaoOpen(false)}
      />
    </div>
  );
}
