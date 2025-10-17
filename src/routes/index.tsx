import { Layout } from "@/components/layout/layout";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageLoader } from "./components/PageLoader";
import { RouteGuard } from "./guards/RouteGuard";
import { LandingPageGuard } from "./LandingPageGuard";
import { LoginPageGuard } from "./LoginPageGuard";

// ============================================
// LAZY LOADING DAS PÁGINAS
// ============================================

// Páginas Protegidas
const Dashboard = lazy(() =>
  import("@/pages/dashboard").then((module) => ({ default: module.Dashboard }))
);
const Transacoes = lazy(() =>
  import("@/pages/transacoes").then((module) => ({
    default: module.Transacoes,
  }))
);
const TransacaoForm = lazy(() =>
  import("@/pages/transacao-form").then((module) => ({
    default: module.TransacaoFormPage,
  }))
);
const Categorias = lazy(() =>
  import("@/pages/categorias").then((module) => ({
    default: module.CategoriasPage,
  }))
);
const Relatorios = lazy(() =>
  import("@/pages/relatorios").then((module) => ({
    default: module.RelatoriosPage,
  }))
);
const Usuarios = lazy(() => import("@/pages/usuarios"));

// Páginas de Erro
const NotFound = lazy(() => import("@/pages/404"));

// ============================================
// COMPONENTE DE ROTAS
// ============================================

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ============================================ */}
        {/* ROTAS PÚBLICAS */}
        {/* ============================================ */}
        <Route path="/" element={<LandingPageGuard />} />
        <Route path="/login" element={<LoginPageGuard />} />

        {/* ============================================ */}
        {/* ROTAS PROTEGIDAS (Requerem autenticação) */}
        {/* ============================================ */}
        <Route element={<RouteGuard />}>
          {/* Layout com Sidebar/Header */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transacoes" element={<Transacoes />} />
            <Route path="/transacoes/nova" element={<TransacaoForm />} />
            <Route path="/transacoes/:id/editar" element={<TransacaoForm />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/usuarios" element={<Usuarios />} />
          </Route>
        </Route>

        {/* ============================================ */}
        {/* ROTAS DE ERRO */}
        {/* ============================================ */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
