import { z } from "zod";

export const categoriaSchema = z.object({
  nome: z.string().min(3, "O nome deve ter ao menos 3 caracteres"),
  descricao: z
    .string()
    .max(200, "A descrição pode ter no máximo 200 caracteres")
    .optional()
    .or(z.literal("")),
  tipo: z.enum(["RECEITA", "DESPESA"]),
  cor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Informe uma cor válida")
    .optional()
    .or(z.literal("")),
  ativa: z.boolean(),
});

export type CategoriaFormValues = z.infer<typeof categoriaSchema>;
