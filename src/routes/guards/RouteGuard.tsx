import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "@/stores/auth/use-user-store";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Guard que protege rotas autenticadas
 * Redireciona para /login se não estiver autenticado
 * Usa Outlet para renderizar rotas filhas
 */
export function RouteGuard() {
  const { isAuthenticated, isLoading } = useUserStore();
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

  // Se não está autenticado E não tem token, redireciona para login
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Renderiza as rotas filhas (Outlet)
  return <Outlet />;
}
