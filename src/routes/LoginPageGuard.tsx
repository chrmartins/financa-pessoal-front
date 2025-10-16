import { Login } from "@/pages/login";
import { useUserStore } from "@/stores/auth/use-user-store";
import { Navigate } from "react-router-dom";

// Componente que redireciona para dashboard se já estiver autenticado (para login)
export function LoginPageGuard() {
  const { isAuthenticated, isHydrated } = useUserStore();

  // Aguardar hidratação do estado (carregamento do localStorage)
  if (!isHydrated) {
    return null;
  }

  // Se já estiver autenticado, redirecionar para dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Caso contrário, mostrar página de login
  return <Login />;
}
