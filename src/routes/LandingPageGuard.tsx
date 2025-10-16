import { LandingPage } from "@/pages/landing";
import { useUserStore } from "@/stores/auth/use-user-store";
import { Navigate } from "react-router-dom";

// Componente que redireciona para dashboard se já estiver autenticado
export function LandingPageGuard() {
  const { isAuthenticated, isHydrated } = useUserStore();

  // Aguardar hidratação do estado (carregamento do localStorage)
  if (!isHydrated) {
    return null; // Ou um loader mínimo
  }

  // Se já estiver autenticado, redirecionar para dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Caso contrário, mostrar landing page
  return <LandingPage />;
}
