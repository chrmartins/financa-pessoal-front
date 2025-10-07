import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsuarioService } from "../../../services/usuarios/usuario-service";

export function useUsuarioDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UsuarioService.desativar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}
