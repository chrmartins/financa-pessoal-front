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
    const response = await api.get("/test", { timeout: 5000 });
    console.log("🟢 API connection test successful:", response.status);
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
 * Interceptor para adicionar token de autenticação (se necessário futuramente)
 */
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config;
  },
  (error) => {
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
        // Limpar token e redirecionar para login (se necessário futuramente)
        // localStorage.removeItem('token')
        // window.location.href = '/login'
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
