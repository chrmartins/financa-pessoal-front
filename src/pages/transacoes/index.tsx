import { useTransacoes } from "../../hooks/queries/transacoes/use-transacoes";
import { TransacoesList } from "./components/TransacoesList";

export function Transacoes() {
  const { data, isLoading } = useTransacoes({
    size: 100, // Buscar todas as transações na página
  });

  return (
    <div>
      <TransacoesList transacoes={data?.content || []} isLoading={isLoading} />
    </div>
  );
}
