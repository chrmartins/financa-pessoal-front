import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsuarioService } from "../../../services/usuarios/usuario-service";
import type { UpdateUsuarioRequest } from "../../../types";

export function useUsuarioUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUsuarioRequest }) =>
      UsuarioService.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["usuario"] });
    },
  });
}
