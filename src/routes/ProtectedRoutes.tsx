import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout/layout";
import { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import { PageLoader } from "./components/PageLoader";

// Lazy loading das páginas protegidas
const Dashboard = lazy(() =>
  import("@/pages/dashboard").then((module) => ({ default: module.Dashboard }))
);
const Transacoes = lazy(() =>
  import("@/pages/transacoes").then((module) => ({
    default: module.Transacoes,
  }))
);
const Categorias = lazy(() =>
  import("@/pages/categorias").then((module) => ({
    default: module.CategoriasPage,
  }))
);
const Usuarios = lazy(() => import("@/pages/usuarios"));
const NotFound = lazy(() => import("@/pages/404"));

// Wrapper para rotas protegidas com layout
const withProtectedLayout = (element: React.ReactNode) => (
  <ProtectedRoute>
    <Layout>{element}</Layout>
  </ProtectedRoute>
);

export const protectedRoutes = [
  <Route key="root" path="/" element={withProtectedLayout(<Dashboard />)} />,
  <Route
    key="dashboard"
    path="/dashboard"
    element={withProtectedLayout(<Dashboard />)}
  />,
  <Route
    key="transacoes"
    path="/transacoes"
    element={withProtectedLayout(<Transacoes />)}
  />,
  <Route
    key="categorias"
    path="/categorias"
    element={withProtectedLayout(<Categorias />)}
  />,
  <Route
    key="usuarios"
    path="/usuarios"
    element={withProtectedLayout(<Usuarios />)}
  />,
  <Route
    key="404"
    path="*"
    element={
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    }
  />,
];
