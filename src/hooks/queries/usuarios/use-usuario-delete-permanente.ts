import { UsuarioService } from "@/services/usuarios/usuario-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook para deletar permanentemente um usuário do sistema
 * ⚠️ ATENÇÃO: Esta ação é irreversível e remove todas as transações e categorias relacionadas
 * 🔒 Apenas ADMIN pode executar
 */
export function useUsuarioDeletarPermanentemente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UsuarioService.deletarPermanentemente(id),
    onSuccess: () => {
      // Invalida a lista de usuários para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });

      // Força o refetch imediato
      queryClient.refetchQueries({ queryKey: ["usuarios"] });
    },
  });
}
