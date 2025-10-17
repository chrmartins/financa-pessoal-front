import axios from "axios";
import { toast } from "sonner";

/**
 * Configuração base do Axios para todas as requisições da aplicação
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Função para testar conectividade com a API
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    await api.get("/test", { timeout: 5000 });
    return true;
  } catch (error) {
    console.warn("🔴 API connection test failed:", error);

    // Tenta um endpoint alternativo se /test não existir
    try {
      await api.get("/", { timeout: 5000 });
      return true;
    } catch (rootError) {
      console.error("🔴 API completely unreachable:", rootError);
      return false;
    }
  }
};

/**
 * Função para fazer logout do usuário de forma limpa
 */
const handleSessionExpired = () => {
  // Limpa todo o estado local
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("usuario");
  localStorage.removeItem("user-store");

  // Mostra mensagem amigável
  toast.error("Sua sessão expirou", {
    description: "Por favor, faça login novamente para continuar.",
    duration: 5000,
  });

  // Aguarda um momento para o toast ser exibido antes de redirecionar
  setTimeout(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, 500);
};

/**
 * Interceptor para adicionar JWT Bearer token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ Nenhum token encontrado para autenticação");
    }
    return config;
  },
  (error) => {
    console.error("❌ Erro no interceptor de requisição:", error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor para tratar respostas e renovar token automaticamente quando expirar
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log detalhado do erro
    if (error.response) {
      const status = error.response?.status;

      // Trata 401 (Unauthorized) - Token expirado/inválido
      // Trata 403 (Forbidden) - Sem permissão para acessar o recurso
      if ((status === 401 || status === 403) && !originalRequest._retry) {
        console.error(
          `🚫 Erro ${status}: ${
            status === 401
              ? "Token expirado ou inválido"
              : "Sem permissão para acessar este recurso"
          }`
        );

        // Não tenta refresh se for a rota de login/refresh
        const isAuthEndpoint =
          originalRequest.url?.includes("/login") ||
          originalRequest.url?.includes("/refresh");

        if (isAuthEndpoint) {
          // Apenas rejeita a requisição sem fazer logout
          return Promise.reject(error);
        }

        // Se for 403, não tenta refresh - redireciona direto para página de não autorizado
        if (status === 403) {
          setTimeout(() => {
            if (typeof window !== "undefined") {
              window.location.href = "/nao-autorizado";
            }
          }, 500);
          return Promise.reject(error);
        }

        // Se for 401, tenta renovar o token
        // Marca que já tentou renovar para evitar loop infinito
        originalRequest._retry = true;

        try {
          // Importação dinâmica para evitar dependência circular
          const { AuthService } = await import("../auth/auth-service");
          const { token } = await AuthService.refreshToken();

          // Atualiza o header da requisição original com novo token
          originalRequest.headers.Authorization = `Bearer ${token}`;

          // Refaz a requisição original com novo token
          return api(originalRequest);
        } catch (refreshError) {
          console.error("❌ Falha ao renovar token (401):", refreshError);

          // Se falhar ao renovar token, faz logout e redireciona para login
          handleSessionExpired();

          return Promise.reject(refreshError);
        }
      }

      // Em desenvolvimento, mostrar informações úteis
      if (import.meta.env.DEV) {
        console.info(
          "🔧 Dica: Verifique se o token está sendo enviado corretamente"
        );
        console.info("🔧 Token atual:", localStorage.getItem("token"));
      }

      return Promise.reject(error);
    }

    if (error.request) {
      console.error("❌ Erro de rede:", error.message);
      return Promise.reject(error);
    }

    console.error("❌ Erro desconhecido:", error.message);
    return Promise.reject(error);
  }
);

// Interceptors são inicializados automaticamente quando o módulo é importado
