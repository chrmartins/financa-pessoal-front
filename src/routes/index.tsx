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
const Configuracoes = lazy(() =>
  import("@/pages/configuracoes").then((module) => ({
    default: module.ConfiguracoesPage,
  }))
);

// Páginas de Feedback (Erros)
const NaoEncontrado = lazy(() => import("@/pages/feedbacks/nao-encontrado"));
const NaoAutorizado = lazy(() => import("@/pages/feedbacks/nao-autorizado"));

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
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
        </Route>

        {/* ============================================ */}
        {/* ROTAS ADMINISTRATIVAS (Requerem ADMIN) */}
        {/* ============================================ */}
        <Route element={<RouteGuard requiredRole={["ADMIN"]} />}>
          <Route element={<Layout />}>
            <Route path="/usuarios" element={<Usuarios />} />
          </Route>
        </Route>

        {/* ============================================ */}
        {/* ROTAS DE FEEDBACK (Erros e Mensagens) */}
        {/* ============================================ */}
        <Route path="/nao-autorizado" element={<NaoAutorizado />} />
        <Route path="/nao-encontrado" element={<NaoEncontrado />} />

        {/* Rotas legadas (redirect para novas rotas) */}
        <Route
          path="/403"
          element={<Navigate to="/nao-autorizado" replace />}
        />
        <Route
          path="/404"
          element={<Navigate to="/nao-encontrado" replace />}
        />

        {/* Fallback para qualquer rota não encontrada */}
        <Route path="*" element={<Navigate to="/nao-encontrado" replace />} />
      </Routes>
    </Suspense>
  );
}
