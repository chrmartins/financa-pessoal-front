import { transacaoService } from "@/services/transacoes/transacao-service";
import type { CreateTransacaoRequest, TransacaoResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Opções para o hook de criação de transações
 */
interface UseTransacaoCreateOptions {
  onSuccess?: (data: TransacaoResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook para criar uma nova transação
 */
export function useTransacaoCreate(options?: UseTransacaoCreateOptions) {
  const queryClient = useQueryClient();

  console.log("🏗️ Hook useTransacaoCreate criado");

  return useMutation({
    mutationFn: (data: CreateTransacaoRequest) => {
      console.log("📡 Mutation iniciada com dados:", data);
      return transacaoService.create(data);
    },
    onSuccess: async (data) => {
      console.log("🎉 SUCCESS! Transação criada:", data);
      console.log("🔄 Investigando queries ativas...");

      // Listar TODAS as queries ativas
      const allQueries = queryClient.getQueryCache().getAll();
      console.log(
        "📊 TODAS as queries no cache:",
        allQueries.map((q) => q.queryKey)
      );

      // Procurar queries específicas de transacoes-list
      const transacoesQueries = allQueries.filter(
        (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "transacoes-list"
      );
      console.log("🎯 Queries de transacoes-list:", transacoesQueries.length);
      transacoesQueries.forEach((q) => {
        console.log("  - Query key:", q.queryKey);
        console.log("  - State:", q.state.status);
      });

      // TESTE: Invalidar com diferentes abordagens
      console.log("🔄 Tentando invalidação...");

      // Abordagem 1: Por predicate
      await queryClient.invalidateQueries({
        predicate: (query) => {
          const isTransacoesList =
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === "transacoes-list";
          if (isTransacoesList) {
            console.log("✅ Invalidando query:", query.queryKey);
          }
          return isTransacoesList;
        },
      });

      console.log("✅ Invalidação concluída!");

      // Chamar callback opcional se fornecido
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("❌ ERROR na mutation:", error);

      // Chamar callback opcional se fornecido
      options?.onError?.(error);
    },
  });
}
