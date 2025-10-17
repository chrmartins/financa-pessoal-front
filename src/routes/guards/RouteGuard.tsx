import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "@/stores/auth/use-user-store";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type RouteGuardProps = {
  requiredRole?: string[]; // Papéis permitidos (ex: ["ADMIN", "GERENTE"])
};

/**
 * Guard que protege rotas autenticadas e valida permissões
 * - Redireciona para /login se não estiver autenticado (401)
 * - Redireciona para /403 se não tiver permissão (403)
 * - Usa Outlet para renderizar rotas filhas
 */
export function RouteGuard({ requiredRole }: RouteGuardProps = {}) {
  const { isAuthenticated, isLoading, user } = useUserStore();
  const location = useLocation();

  // Verificar se há token no localStorage como fallback
  const hasToken =
    typeof window !== "undefined" &&
    localStorage.getItem("token") !== null &&
    localStorage.getItem("usuario") !== null;

  // Mostrar loading enquanto valida token ou se houver token mas ainda não autenticado
  if (isLoading || (hasToken && !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner className="h-8 w-8 mx-auto" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }

  // Se não está autenticado E não tem token, redireciona para login (401)
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se está autenticado MAS não tem a permissão necessária, redireciona para não autorizado
  if (isAuthenticated && requiredRole && requiredRole.length > 0) {
    const userRole = user?.papel;

    // Verifica se o papel do usuário está na lista de papéis permitidos
    if (!userRole || !requiredRole.includes(userRole)) {
      return (
        <Navigate to="/nao-autorizado" state={{ from: location }} replace />
      );
    }
  }

  // Renderiza as rotas filhas (Outlet)
  return <Outlet />;
}
