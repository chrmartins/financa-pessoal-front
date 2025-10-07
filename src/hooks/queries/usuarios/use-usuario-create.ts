import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsuarioService } from "../../../services/usuarios/usuario-service";
import type { CreateUsuarioRequest } from "../../../types";

export function useUsuarioCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUsuarioRequest) => UsuarioService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}
