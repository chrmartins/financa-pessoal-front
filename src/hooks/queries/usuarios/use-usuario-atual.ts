import { useQuery } from "@tanstack/react-query";
import { UsuarioService } from "../../../services/usuarios/usuario-service";

export function useUsuarioAtual() {
  return useQuery({
    queryKey: ["usuario", "atual"],
    queryFn: () => UsuarioService.obterUsuarioAtual(),
  });
}
