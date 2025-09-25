/**
 * Utilitários para cálculos financeiros
 */

export interface TransacaoCalculo {
  id: string | number; // Aceitar tanto string (UUID) quanto number
  tipo: "RECEITA" | "DESPESA";
  valor: number;
  dataTransacao: string;
}

export interface ResumoFinanceiro {
  saldo: number;
  receitas: number;
  despesas: number;
  economias: number;
  totalTransacoes: number;
}

/**
 * Calcula resumo financeiro a partir de uma lista de transações
 */
export function calcularResumoFinanceiro(
  transacoes: TransacaoCalculo[]
): ResumoFinanceiro {
  console.log("🧮 Calculando resumo financeiro:", {
    totalTransacoes: transacoes.length,
    transacoes: transacoes.slice(0, 3), // Mostrar apenas as 3 primeiras para debug
  });

  const receitas = transacoes
    .filter((t) => t.tipo === "RECEITA")
    .reduce((sum, t) => {
      const valor = Number(t.valor) || 0; // Garantir que é número
      return sum + valor;
    }, 0);

  const despesas = transacoes
    .filter((t) => t.tipo === "DESPESA")
    .reduce((sum, t) => {
      const valor = Number(t.valor) || 0; // Garantir que é número
      return sum + valor;
    }, 0);

  const saldo = receitas - despesas;

  // Economia como 20% do saldo se positivo
  const economias = saldo > 0 ? saldo * 0.2 : 0;

  const resultado = {
    saldo: isNaN(saldo) ? 0 : saldo,
    receitas: isNaN(receitas) ? 0 : receitas,
    despesas: isNaN(despesas) ? 0 : despesas,
    economias: isNaN(economias) ? 0 : economias,
    totalTransacoes: transacoes.length,
  };

  console.log("📊 Resultado do cálculo:", resultado);

  return resultado;
}

/**
 * Formatar dados de resumo com comparação mensal (opcional)
 */
export interface ResumoComComparacao extends ResumoFinanceiro {
  saldoComparacao?: number;
  receitasComparacao?: number;
  despesasComparacao?: number;
  economiasComparacao?: number;
}

export function formatarResumoComComparacao(
  resumoAtual: ResumoFinanceiro,
  resumoAnterior?: ResumoFinanceiro
): ResumoComComparacao {
  if (!resumoAnterior) {
    return resumoAtual;
  }

  const calcularVariacao = (atual: number, anterior: number): number => {
    if (anterior === 0) return atual > 0 ? 100 : 0;
    return ((atual - anterior) / anterior) * 100;
  };

  return {
    ...resumoAtual,
    saldoComparacao: calcularVariacao(resumoAtual.saldo, resumoAnterior.saldo),
    receitasComparacao: calcularVariacao(
      resumoAtual.receitas,
      resumoAnterior.receitas
    ),
    despesasComparacao: calcularVariacao(
      resumoAtual.despesas,
      resumoAnterior.despesas
    ),
    economiasComparacao: calcularVariacao(
      resumoAtual.economias,
      resumoAnterior.economias
    ),
  };
}
