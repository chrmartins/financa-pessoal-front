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
 * Interceptor para adicionar credenciais Basic Auth
 */
api.interceptors.request.use(
  (config) => {
    const credentials = localStorage.getItem("token");

    console.log("🚀 Requisição para:", config.url);
    console.log("🔑 Credenciais disponíveis:", !!credentials);

    if (credentials) {
      config.headers.Authorization = `Basic ${credentials}`;
      console.log(
        "🔑 Basic Auth adicionado à requisição:",
        `Basic ${credentials.substring(0, 20)}...`
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
 * Interceptor para tratar respostas e erros globalmente
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log detalhado do erro
    if (error.response) {
      if (error.response?.status === 401) {
        console.error("🚫 Erro 401: Não autorizado. Verificar autenticação.");
        console.log("📋 Headers da requisição:", error.config?.headers);

        // Em desenvolvimento, mostrar informações úteis
        if (import.meta.env.DEV) {
          console.log(
            "🔧 Dica: Verifique se o token está sendo enviado corretamente"
          );
          console.log("🔧 Token atual:", localStorage.getItem("token"));
        }

        // Limpar token inválido
        localStorage.removeItem("token");
        // window.location.href = '/login' // Descomente quando tiver tela de login
      }

      return Promise.reject(error);
    }

    if (error.request) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Interceptors são inicializados automaticamente quando o módulo é importado
