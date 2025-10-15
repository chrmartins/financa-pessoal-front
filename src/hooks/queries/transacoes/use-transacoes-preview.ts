import { transacaoService } from "@/services/transacoes/transacao-service";
import type { TransacaoResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para buscar preview de transações FIXA futuras (não criadas ainda no banco)
 * Útil quando usuário navega para meses distantes antes do JOB criar as transações
 */
export function useTransacoesPreview(mes: number, ano: number) {
  const shouldFetchPreview = isMonthAfter12Months(mes, ano);

  const result = useQuery<TransacaoResponse[]>({
    queryKey: ["transacoes-preview", mes, ano],
    queryFn: () => transacaoService.preview(mes, ano),
    // Só busca preview para meses APÓS 12 meses do mês atual
    // Exemplo: estamos em OUT/2025 → preview só aparece em NOV/2026 em diante
    enabled: shouldFetchPreview,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // PROTEÇÃO CRÍTICA: Se não deveria buscar preview, SEMPRE retornar array vazio
  // Isso evita que cache antigo seja usado quando enabled: false
  return {
    ...result,
    data: shouldFetchPreview ? result.data : [],
  };
}

/**
 * Verifica se o mês/ano está APÓS 12 meses do mês atual
 * Exemplo: hoje = OUT/2025 → retorna true para NOV/2026+, false para OUT/2026 ou anterior
 */
function isMonthAfter12Months(mes: number, ano: number): boolean {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth(); // 0-11

  // Data alvo: o mês/ano que o usuário está visualizando
  const dataAlvo = new Date(ano, mes - 1, 1);

  // Data limite: 12 meses a partir de hoje
  // Exemplo: OUT/2025 (mes=9) + 12 meses = OUT/2026
  const dataLimite12Meses = new Date(anoAtual, mesAtual + 12, 1);

  // Preview só aparece DEPOIS de 12 meses
  // Exemplo: OUT/2025 → preview só em NOV/2026+
  return dataAlvo >= dataLimite12Meses;
}
