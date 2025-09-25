import { z } from "zod";

// Schema para Categoria
export const categoriaSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  descricao: z
    .string()
    .max(200, "Descrição deve ter no máximo 200 caracteres")
    .optional(),
  cor: z
    .string()
    .min(1, "Cor é obrigatória")
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Cor deve estar em formato hexadecimal válido"
    ),
});

export const updateCategoriaSchema = categoriaSchema.partial();

// Schema para Transação
export const transacaoSchema = z.object({
  descricao: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(3, "Descrição deve ter pelo menos 3 caracteres")
    .max(100, "Descrição deve ter no máximo 100 caracteres"),
  valor: z
    .number()
    .positive("Valor deve ser positivo")
    .max(999999.99, "Valor deve ser menor que R$ 999.999,99"),
  dataTransacao: z.string().min(1, "Data é obrigatória"),
  tipo: z.enum(["RECEITA", "DESPESA"]),
  categoriaId: z.string().min(1, "Categoria deve ser válida"),
  observacoes: z.string().optional(),
});

export const updateTransacaoSchema = transacaoSchema.partial();

// Schema para filtros de transação
export const transacaoFiltersSchema = z.object({
  page: z.number().min(0).default(0),
  size: z.number().min(1).max(100).default(20),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  categoriaId: z.string().optional(),
  tipo: z.enum(["RECEITA", "DESPESA"]).optional(),
});

// Schema para formulário de valor monetário
export const valorSchema = z
  .string()
  .min(1, "Valor é obrigatório")
  .refine((value) => {
    // Remove formatação e tenta converter para número
    const cleanValue = value.replace(/[^\d,.-]/g, "").replace(",", ".");
    const num = parseFloat(cleanValue);
    return !isNaN(num) && num > 0;
  }, "Valor deve ser um número positivo válido")
  .transform((value) => {
    const cleanValue = value.replace(/[^\d,.-]/g, "").replace(",", ".");
    return parseFloat(cleanValue);
  });

// Schema para login (se necessário futuramente)
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail deve ser válido"),
  senha: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

// Types derivados dos schemas
export type CategoriaFormData = z.infer<typeof categoriaSchema>;
export type UpdateCategoriaFormData = z.infer<typeof updateCategoriaSchema>;
export type TransacaoFormData = z.infer<typeof transacaoSchema>;
export type UpdateTransacaoFormData = z.infer<typeof updateTransacaoSchema>;
export type TransacaoFiltersData = z.infer<typeof transacaoFiltersSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
