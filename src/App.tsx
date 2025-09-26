import { Layout } from "@/components/layout/layout";
import { useUIStore } from "@/stores/ui/use-ui-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Importação dos interceptors para configuração automática
import "@/services/middleware/interceptors";

// Lazy loading das páginas
const Dashboard = lazy(() =>
  import("@/pages/dashboard").then((module) => ({ default: module.Dashboard }))
);
const Transacoes = lazy(() =>
  import("@/pages/transacoes").then((module) => ({
    default: module.Transacoes,
  }))
);

// Importação dos interceptors para configuração automática
import "@/services/middleware/interceptors";

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Removido staleTime global para permitir invalidação imediata
    },
  },
});

function App() {
  const { setIsMobile } = useUIStore();

  // Detectar se é mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, [setIsMobile]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transacoes" element={<Transacoes />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
