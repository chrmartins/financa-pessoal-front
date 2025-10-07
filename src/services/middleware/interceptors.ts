import axios from "axios";

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
      const response = await api.get("/", { timeout: 5000 });
      console.log("🟡 API root endpoint accessible:", response.status);
      return true;
    } catch (rootError) {
      console.error("🔴 API completely unreachable:", rootError);
      return false;
    }
  }
};

/**
 * Interceptor para adicionar JWT Bearer token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("🚀 Requisição para:", config.url);
    console.log("🔑 Token disponível:", !!token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "🔑 JWT Bearer adicionado à requisição:",
        `Bearer ${token.substring(0, 20)}...`
      );
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

      // Trata 401 (Unauthorized) como token expirado
      if (status === 401 && !originalRequest._retry) {
        console.error("🚫 Erro 401: Token expirado ou inválido");

        // Marca que já tentou renovar para evitar loop infinito
        originalRequest._retry = true;

        try {
          console.log("� Tentando renovar token...");

          // Importação dinâmica para evitar dependência circular
          const { AuthService } = await import("../auth/auth-service");
          const { token } = await AuthService.refreshToken();

          // Atualiza o header da requisição original com novo token
          originalRequest.headers.Authorization = `Bearer ${token}`;

          console.log("✅ Token renovado, refazendo requisição original");

          // Refaz a requisição original com novo token
          return api(originalRequest);
        } catch (refreshError) {
          console.error("❌ Falha ao renovar token:", refreshError);

          // Se falhar ao renovar, limpa localStorage e redireciona para login
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("usuario");
          localStorage.removeItem("user-store");

          // Redireciona para login
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        }
      }

      if (status === 403) {
        console.warn(
          "🚫 Erro 403: Acesso negado. Verifique permissões do usuário."
        );
        return Promise.reject(error);
      }

      // Em desenvolvimento, mostrar informações úteis
      if (import.meta.env.DEV) {
        console.log(
          "🔧 Dica: Verifique se o token está sendo enviado corretamente"
        );
        console.log("🔧 Token atual:", localStorage.getItem("token"));
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
