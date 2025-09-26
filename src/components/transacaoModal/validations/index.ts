import { parseCurrencyInput } from "@/utils";
import { z } from "zod";

export const formSchema = z
  .object({
    descricao: z.string().min(1, "Descrição é obrigatória"),
    valorFormatado: z
      .string()
      .min(1, "Valor é obrigatório")
      .refine((val) => {
        const numericValue = parseCurrencyInput(val);
        return numericValue > 0 && !isNaN(numericValue);
      }, "Valor deve ser um número maior que zero"),
    dataTransacao: z.string().min(1, "Data é obrigatória"),
    tipo: z.enum(["RECEITA", "DESPESA"]),
    categoriaId: z.string().min(1, "Selecione uma categoria"),
    observacoes: z.string().optional(),
    recorrente: z.boolean(),
    quantidadeParcelas: z
      .number()
      .min(2, "Mínimo 2 parcelas para transações recorrentes"),
  })
  .refine(
    (data) => {
      if (data.recorrente && data.quantidadeParcelas < 2) {
        return false;
      }
      return true;
    },
    {
      message: "Para transações recorrentes, defina pelo menos 2 parcelas",
      path: ["quantidadeParcelas"],
    }
  );

export type FormData = z.infer<typeof formSchema>;