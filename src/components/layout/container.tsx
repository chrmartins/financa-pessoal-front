import { cn } from "@/utils";
import type { ReactNode } from "react";

/**
 * Variantes de container para diferentes tipos de conteúdo
 */
type ContainerVariant =
  | "default" // 1400px - Dashboards, cards, gráficos
  | "wide" // 1600px - Tabelas de dados
  | "narrow" // 800px  - Formulários, leitura
  | "marketing" // 1200px - Landing pages, assinatura
  | "full"; // 100%   - Sem limitação

interface ContainerProps {
  children: ReactNode;
  variant?: ContainerVariant;
  className?: string;
  /**
   * Remove padding padrão
   * Útil quando o conteúdo interno já tem padding
   */
  noPadding?: boolean;
}

/**
 * Container responsivo que limita largura em telas grandes
 *
 * @example
 * // Dashboard com cards
 * <Container variant="default">
 *   <DashboardCards />
 * </Container>
 *
 * @example
 * // Tabela de dados
 * <Container variant="wide">
 *   <TransacoesTable />
 * </Container>
 *
 * @example
 * // Formulário
 * <Container variant="narrow">
 *   <Form />
 * </Container>
 */
export function Container({
  children,
  variant = "default",
  className,
  noPadding = false,
}: ContainerProps) {
  return (
    <div
      className={cn(
        // Base: centralizado
        "mx-auto w-full",

        // Padding responsivo (se não desabilitado)
        !noPadding && "px-4 sm:px-6 lg:px-8",

        // Variantes de largura máxima
        {
          "max-w-[1400px]": variant === "default", // Dashboard padrão
          "max-w-[1600px]": variant === "wide", // Tabelas
          "max-w-[800px]": variant === "narrow", // Formulários
          "max-w-[1200px]": variant === "marketing", // Marketing
          "max-w-none": variant === "full", // Sem limite
        },

        // Classes customizadas
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Container específico para seções de dashboard
 * Já inclui espaçamento vertical
 */
export function DashboardContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Container variant="default" className={cn("space-y-6", className)}>
      {children}
    </Container>
  );
}

/**
 * Container específico para tabelas
 * Largura maior para acomodar mais colunas
 */
export function TableContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Container variant="wide" className={cn("space-y-6", className)}>
      {children}
    </Container>
  );
}

/**
 * Container específico para formulários
 * Largura estreita para melhor legibilidade
 */
export function FormContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Container variant="narrow" className={cn("py-8", className)}>
      {children}
    </Container>
  );
}

/**
 * Container específico para páginas de marketing
 * (Landing page, Assinatura, etc.)
 */
export function MarketingContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Container variant="marketing" className={cn("py-8 sm:py-12", className)}>
      {children}
    </Container>
  );
}
