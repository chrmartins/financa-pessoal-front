import { useQuery } from "@tanstack/react-query";
import { UsuarioService } from "../../../services/usuarios/usuario-service";

export function useUsuarioDetail(id: string) {
  return useQuery({
    queryKey: ["usuario", id],
    queryFn: () => UsuarioService.buscarPorId(id),
    enabled: !!id,
  });
}
