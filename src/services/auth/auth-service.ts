import { api } from "@/services/middleware/interceptors";
import { isAxiosError } from "axios";

// Tipos para autenticação JWT
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface ApiLoginResponse {
  usuario: {
    id: string;
    nome: string;
    email: string;
    papel: string;
    ativo: boolean;
    dataCriacao: string;
    dataAtualizacao?: string;
    ultimoAcesso?: string;
  };
  token: string; // JWT Access Token
  refreshToken: string; // JWT Refresh Token
  expiresIn: number; // Tempo de expiração em milissegundos
}

export interface LoginResponse {
  user: ApiLoginResponse["usuario"];
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  password: string;
}

/**
 * Serviço de autenticação
 */
export class AuthService {
  /**
   * Fazer login usando endpoint dedicado e preparar credenciais Basic
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Chamada ao novo endpoint de autenticação
      const { data } = await api.post<ApiLoginResponse>("/auth", {
        email,
        senha: password,
      });

      if (!data?.usuario || !data?.token || !data?.refreshToken) {
        throw new Error("Resposta de login inválida. Tente novamente.");
      }

      // Armazenar tokens
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      return {
        user: data.usuario,
        token: data.token,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
      };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 401) {
          console.error("🚫 Erro 401 - Credenciais inválidas");
          throw new Error("Email ou senha incorretos");
        }

        if (status === 403) {
          console.error("🚫 Erro 403 - Acesso negado");
          throw new Error("Acesso negado. Verifique suas permissões.");
        }

        if (status && status >= 500) {
          console.error("🔥 Erro do servidor:", status);
          throw new Error(
            "Erro interno do servidor. Tente novamente mais tarde."
          );
        }

        // Log detalhado para debug
        console.error("📊 Detalhes do erro:", {
          status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            headers: error.config?.headers,
          },
        });

        const message =
          (typeof error.response?.data === "object" &&
          error.response?.data !== null &&
          "message" in error.response.data &&
          typeof error.response.data.message === "string"
            ? error.response.data.message
            : undefined) ||
          error.message ||
          "Erro ao fazer login. Tente novamente.";

        throw new Error(message);
      }

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Erro ao fazer login. Tente novamente.");
    }
  }

  /**
   * Renovar token usando refresh token
   */
  static async refreshToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      console.error("❌ Refresh token não encontrado");
      throw new Error("Refresh token não encontrado");
    }

    try {
      const { data } = await api.post<ApiLoginResponse>("/auth/refresh", {
        refreshToken,
      });

      if (!data?.usuario || !data?.token || !data?.refreshToken) {
        console.error("❌ Resposta de refresh inválida");
        throw new Error("Falha ao renovar token");
      }

      // Atualizar tokens armazenados
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      return {
        user: data.usuario,
        token: data.token,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
      };
    } catch (error: unknown) {
      console.error("❌ Erro ao renovar token:", error);

      // Se refresh token inválido, limpa tudo e força novo login
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("usuario");

      const message = isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
        ? error.message
        : "Sessão expirada. Faça login novamente.";

      throw new Error(message || "Sessão expirada. Faça login novamente.");
    }
  }

  /**
   * Fazer logout
   */
  static async logout(): Promise<void> {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");
  }

  /**
   * Validar se o token ainda é válido fazendo uma chamada à API
   */
  static async validateToken(): Promise<boolean> {
    try {
      // Faz uma chamada simples para validar o token
      await api.get("/usuarios/atual");
      return true;
    } catch {
      console.warn("🚫 Token inválido ou expirado");
      return false;
    }
  }

  /**
   * Obter usuário autenticado
   */
  static getUsuario(): ApiLoginResponse["usuario"] | null {
    const usuarioData = localStorage.getItem("usuario");
    if (!usuarioData) {
      return null;
    }

    try {
      return JSON.parse(usuarioData) as ApiLoginResponse["usuario"];
    } catch (error) {
      console.warn("⚠️ Não foi possível parsear o usuário salvo:", error);
      return null;
    }
  }

  /**
   * Verificar se está autenticado
   */
  static isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  /**
   * Método de teste para API
   */
  static async testApiEndpoints(): Promise<void> {
    const logAxiosError = (context: string, err: unknown) => {
      if (isAxiosError(err)) {
        console.error(context, err.response?.status, err.message);
      } else {
        console.error(context, err);
      }
    };

    try {
      await api.get("/categorias");
    } catch (error: unknown) {
      logAxiosError("❌ Erro na API (sem auth):", error);
    }

    try {
      const adminCredentials = btoa("admin@financeiro.com:admin123");
      const headers = {
        Authorization: `Basic ${adminCredentials}`,
        "Content-Type": "application/json",
      } as const;

      await api.get("/usuarios/550e8400-e29b-41d4-a716-446655440003", {
        headers,
      });

      await api.get("/transacoes", {
        headers,
      });

      try {
        await api.get(
          "/transacoes/usuario/550e8400-e29b-41d4-a716-446655440003",
          {
            headers,
          }
        );
      } catch (error: unknown) {
        logAxiosError("⚠️ Erro ao consultar transações do admin:", error);
      }

      try {
        await api.get(
          "/transacoes/usuario/550e8400-e29b-41d4-a716-446655440001",
          {
            headers,
          }
        );
      } catch (error: unknown) {
        logAxiosError(
          "⚠️ Erro ao consultar transações do usuário principal:",
          error
        );
      }

      await this.login("admin@financeiro.com", "admin123");
    } catch (error: unknown) {
      logAxiosError("❌ Erro no teste admin:", error);
    }
  }

  /**
   * Criar usuário de teste
   */
  static async createTestUser(): Promise<LoginResponse> {
    // Mock para desenvolvimento
    return {
      user: {
        id: "test-id",
        nome: "Admin Sistema",
        email: "admin@financeiro.com",
        papel: "ADMIN",
        ativo: true,
        dataCriacao: new Date().toISOString(),
      },
      token: "mock-jwt-token",
      refreshToken: "mock-refresh-token",
      expiresIn: 86400000,
    };
  }
}
