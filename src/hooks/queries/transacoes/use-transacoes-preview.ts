import { transacaoService } from "@/services/transacoes/transacao-service";
import type { TransacaoResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para buscar preview de transações FIXA futuras (não criadas ainda no banco)
 * Útil quando usuário navega para meses distantes antes do JOB criar as transações
 */
export function useTransacoesPreview(mes: number, ano: number) {
  return useQuery<TransacaoResponse[]>({
    queryKey: ["transacoes-preview", mes, ano],
    queryFn: () => transacaoService.preview(mes, ano),
    // Só busca preview para meses futuros (6 meses à frente)
    enabled: isMonthInFuture(mes, ano, 6),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Verifica se o mês/ano está X meses no futuro
 */
function isMonthInFuture(
  mes: number,
  ano: number,
  mesesAFrente: number
): boolean {
  const hoje = new Date();
  const dataAlvo = new Date(ano, mes - 1, 1);
  const dataLimite = new Date(
    hoje.getFullYear(),
    hoje.getMonth() + mesesAFrente,
    1
  );

  return dataAlvo > dataLimite;
}
