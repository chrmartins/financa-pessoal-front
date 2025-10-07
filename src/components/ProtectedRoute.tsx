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

  // DEBUG: Log do estado
  console.log("🛡️ PROTECTED ROUTE - Verificando acesso:", {
    pathname: location.pathname,
    isAuthenticated,
    isLoading,
  });

  // Mostrar loading enquanto valida token
  if (isLoading) {
    console.log("⏳ PROTECTED ROUTE - Mostrando loading...");
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

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    console.log(
      "🚫 PROTECTED ROUTE - Não autenticado, redirecionando para /login"
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se está autenticado, mostra o conteúdo
  console.log("✅ PROTECTED ROUTE - Autenticado, mostrando conteúdo");
  return <>{children}</>;
};
