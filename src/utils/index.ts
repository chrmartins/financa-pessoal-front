import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | undefined | null): string {
  // Tratar valores nulos, undefined ou NaN
  const numericValue = Number(value) || 0;

  if (isNaN(numericValue)) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
}

/**
 * Formatar entrada de moeda conforme usuário digita
 */
export function formatCurrencyInput(value: string): string {
  // Remover tudo exceto dígitos
  const digits = value.replace(/\D/g, "");

  if (!digits) return "";

  // Converter para cents
  const cents = parseInt(digits);
  const reais = cents / 100;

  // Formatar como moeda brasileira sem símbolo R$
  return reais.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Parsear string formatada de volta para número
 */
export function parseCurrencyInput(value: string): number {
  if (!value || value.trim() === "") {
    return 0;
  }

  // Remover pontos (milhares) e substituir vírgula por ponto (decimais)
  const cleaned = value.replace(/\./g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj);
}

export function formatDateWithTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const datePart = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj);

  const timePart = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);

  return `${datePart} : ${timePart}`;
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}
