import { parseCurrencyInput } from "@/utils";

interface CategoriaResumo {
  nome: string;
  cor?: string | null;
}

/**
 * Função para gerar cor baseada no nome da categoria
 */
export const getCategoriaColor = (categoria: CategoriaResumo) => {
  if (categoria.cor) {
    return categoria.cor;
  }

  // Cores predefinidas baseadas no nome
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-red-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-violet-500",
  ];

  // Gerar índice baseado no hash do nome
  const hash = categoria.nome
    .split("")
    .reduce(
      (acc: number, char: string) => char.charCodeAt(0) + ((acc << 5) - acc),
      0
    );

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Opções de quantidade de recorrências
 */
export const opcoesQuantidade = [
  ...Array.from({ length: 23 }, (_, i) => i + 2), // 2 a 24
  30,
  36,
  48,
  60, // Opções extras para financiamentos
];

/**
 * Gera texto de exemplo para transação recorrente
 */
export const getExemploTexto = (
  recorrente: boolean,
  quantidadeParcelas: number,
  valorFormatado: string,
  tipo: "RECEITA" | "DESPESA"
) => {
  const valor = parseCurrencyInput(valorFormatado);
  if (!recorrente || !quantidadeParcelas || !valor) return "";

  const totalValue = valor * quantidadeParcelas;
  const tipoTexto = tipo === "RECEITA" ? "receita" : "despesa";

  return `${quantidadeParcelas}x ${tipoTexto}s mensais de ${valor.toLocaleString(
    "pt-BR",
    { style: "currency", currency: "BRL" }
  )} = ${totalValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })} total`;
};
