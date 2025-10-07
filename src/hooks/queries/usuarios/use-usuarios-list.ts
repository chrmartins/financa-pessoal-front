import { useQuery } from "@tanstack/react-query";
import { UsuarioService } from "../../../services/usuarios/usuario-service";

export function useUsuariosList() {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: () => UsuarioService.listarUsuarios(),
  });
}
