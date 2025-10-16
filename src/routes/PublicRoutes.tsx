import { useUserStore } from "@/stores/auth/use-user-store";
import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";

// Lazy loading das páginas públicas
const Landing = lazy(() =>
  import("@/pages/landing").then((module) => ({ default: module.LandingPage }))
);

const Login = lazy(() =>
  import("@/pages/login").then((module) => ({ default: module.Login }))
);

// Componente que redireciona para dashboard se já estiver autenticado
function LandingPageGuard() {
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
  return <Landing />;
}

// Componente que redireciona para dashboard se já estiver autenticado (para login)
function LoginPageGuard() {
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

export const publicRoutes = [
  <Route key="landing" path="/" element={<LandingPageGuard />} />,
  <Route key="login" path="/login" element={<LoginPageGuard />} />,
];
