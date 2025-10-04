import { api } from "@/services/middleware/interceptors";

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
      console.log("🔐 Tentativa de login para:", email);

      // Chamada ao novo endpoint de autenticação
      const { data } = await api.post<ApiLoginResponse>("/auth", {
        email,
        senha: password,
      });

      if (!data?.usuario || !data?.token || !data?.refreshToken) {
        console.error("❌ Resposta de login inválida");
        throw new Error("Resposta de login inválida. Tente novamente.");
      }

      console.log("👤 Usuário autenticado:", data.usuario.nome);
      console.log("🔑 Token JWT recebido");
      console.log("⏰ Expira em:", data.expiresIn, "ms");

      // Armazenar tokens
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      console.log("🎉 Login realizado com sucesso!");

      return {
        user: data.usuario,
        token: data.token,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
      };
    } catch (error: any) {
      console.error("❌ Erro no login:", error);

      if (error.response?.status === 401) {
        console.error("🚫 Erro 401 - Credenciais inválidas");
        throw new Error("Email ou senha incorretos");
      }

      if (error.response?.status === 403) {
        console.error("🚫 Erro 403 - Acesso negado");
        throw new Error("Acesso negado. Verifique suas permissões.");
      }

      if (error.response?.status >= 500) {
        console.error("🔥 Erro do servidor:", error.response.status);
        throw new Error(
          "Erro interno do servidor. Tente novamente mais tarde."
        );
      }

      // Log detalhado para debug
      console.error("📊 Detalhes do erro:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          headers: error.config?.headers,
        },
      });

      throw new Error(error.message || "Erro ao fazer login. Tente novamente.");
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
      console.log("🔄 Renovando token...");

      const { data } = await api.post<ApiLoginResponse>("/auth/refresh", {
        refreshToken,
      });

      if (!data?.usuario || !data?.token || !data?.refreshToken) {
        console.error("❌ Resposta de refresh inválida");
        throw new Error("Falha ao renovar token");
      }

      console.log("✅ Token renovado com sucesso");

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
    } catch (error: any) {
      console.error("❌ Erro ao renovar token:", error);

      // Se refresh token inválido, limpa tudo e força novo login
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("usuario");

      throw new Error("Sessão expirada. Faça login novamente.");
    }
  }

  /**
   * Fazer logout
   */
  static async logout(): Promise<void> {
    console.log("🚪 Fazendo logout...");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");
    console.log("✅ Logout realizado");
  }

  /**
   * Obter usuário autenticado
   */
  static getUsuario(): any {
    const usuarioData = localStorage.getItem("usuario");
    if (usuarioData) {
      return JSON.parse(usuarioData);
    }
    return null;
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
    console.log("🧪 Testando API...");

    try {
      // Teste básico sem autenticação
      const response = await api.get("/categorias");
      console.log(
        "✅ API funcionando (sem auth):",
        response.data.length,
        "categorias"
      );
    } catch (error: any) {
      console.error(
        "❌ Erro na API (sem auth):",
        error.response?.status,
        error.message
      );
    }

    // Teste com credenciais do admin
    console.log("🧪 Testando com credenciais admin...");
    try {
      const adminCredentials = btoa("admin@financeiro.com:admin123");

      // Testar usuário específico
      const userResponse = await api.get(
        "/usuarios/550e8400-e29b-41d4-a716-446655440003",
        {
          headers: {
            Authorization: `Basic ${adminCredentials}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Usuário admin encontrado:", userResponse.data);

      // Testar todas as transações
      console.log("🧪 Testando endpoint /transacoes...");
      const transacoesResponse = await api.get("/transacoes", {
        headers: {
          Authorization: `Basic ${adminCredentials}`,
          "Content-Type": "application/json",
        },
      });
      console.log(
        "📊 Total de transações na API:",
        transacoesResponse.data.length
      );
      console.log(
        "📋 Primeiras 3 transações:",
        transacoesResponse.data.slice(0, 3)
      );

      // Testar transações específicas do usuário admin
      try {
        console.log(
          "🧪 Testando transações do usuário admin (550e8400-e29b-41d4-a716-446655440003)..."
        );
        const transacoesAdminResponse = await api.get(
          "/transacoes/usuario/550e8400-e29b-41d4-a716-446655440003",
          {
            headers: {
              Authorization: `Basic ${adminCredentials}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(
          "📊 Transações do admin:",
          transacoesAdminResponse.data.length
        );
      } catch (error: any) {
        console.log(
          "⚠️ Transações do admin não encontradas:",
          error.response?.status
        );
      }

      // Testar transações do usuário que tem dados no banco
      try {
        console.log(
          "🧪 Testando transações do usuário principal (550e8400-e29b-41d4-a716-446655440001)..."
        );
        const transacoesUsuarioResponse = await api.get(
          "/transacoes/usuario/550e8400-e29b-41d4-a716-446655440001",
          {
            headers: {
              Authorization: `Basic ${adminCredentials}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(
          "📊 Transações do usuário principal:",
          transacoesUsuarioResponse.data.length
        );
        console.log(
          "📋 Primeiras 3 transações do usuário:",
          transacoesUsuarioResponse.data.slice(0, 3)
        );
      } catch (error: any) {
        console.log(
          "⚠️ Transações do usuário principal não encontradas:",
          error.response?.status
        );
      }

      // Testar login com essas credenciais
      console.log("🧪 Testando login admin...");
      const loginResult = await this.login("admin@financeiro.com", "admin123");
      console.log("✅ Login admin funcionou:", loginResult.user.nome);
    } catch (error: any) {
      console.error(
        "❌ Erro no teste admin:",
        error.response?.status,
        error.message
      );
      console.log("📋 Response data:", error.response?.data);
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
