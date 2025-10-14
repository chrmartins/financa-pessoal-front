import { useUserStore } from "@/stores/auth/use-user-store";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spinner } from "./ui/spinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Componente para proteger rotas que precisam de autenticação
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
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

  return <>{children}</>;
};
