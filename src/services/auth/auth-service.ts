import { api } from "@/services/middleware/interceptors";

// Tipos para autenticação
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  credentials: string; // Base64 encoded email:password
  user: {
    id: string;
    nome: string;
    email: string;
    papel: string;
    ativo: boolean;
    dataCriacao: string;
    dataAtualizacao?: string;
    ultimoAcesso?: string;
  };
  categorias: Array<{
    id: string;
    nome: string;
    descricao: string;
    tipo: "RECEITA" | "DESPESA";
    ativa: boolean;
    dataCriacao: string;
    dataAtualizacao?: string;
  }>;
  transacoes: Array<{
    id: string;
    descricao: string;
    valor: number;
    dataTransacao: string;
    tipo: "RECEITA" | "DESPESA";
    observacoes?: string;
    dataCriacao: string;
    dataAtualizacao?: string;
    categoria: {
      id: string;
      nome: string;
      descricao: string;
      tipo: "RECEITA" | "DESPESA";
      ativa: boolean;
      dataCriacao: string;
      dataAtualizacao?: string;
    };
  }>;
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
   * Fazer login usando Basic Authentication
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log("🔐 Tentativa de login para:", email);

      // Criar credenciais Basic Auth
      const credentials = btoa(`${email}:${password}`);

      // Primeiro, verificar se o usuário existe e está ativo
      console.log("� Verificando usuário...");
      const usuariosResponse = await api.get("/usuarios", {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📋 Usuários encontrados:", usuariosResponse.data.length);

      const usuario = usuariosResponse.data.find((u: any) => u.email === email);

      if (!usuario) {
        console.error("❌ Usuário não encontrado para o email:", email);
        throw new Error("Usuário não encontrado");
      }

      if (!usuario.ativo) {
        console.error("❌ Usuário inativo:", email);
        throw new Error(
          "Usuário inativo. Entre em contato com o administrador."
        );
      }

      console.log("✅ Usuário encontrado e ativo:", usuario.nome);

      // Buscar categorias (teste de autorização)
      console.log("🔐 Testando autorização com categorias...");
      const categoriasResponse = await api.get("/categorias", {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Categorias carregadas:", categoriasResponse.data.length);

      // Buscar transações
      console.log("💰 Carregando transações...");

      // Para admin, buscar todas as transações; para usuários normais, buscar apenas as suas
      let transacoesResponse;
      if (usuario.papel === "ADMIN") {
        console.log("👑 Usuário é admin, buscando todas as transações");
        transacoesResponse = await api.get("/transacoes", {
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
        });
        console.log(
          "✅ Todas as transações carregadas (admin):",
          transacoesResponse.data.length
        );
      } else {
        console.log(
          "� Usuário normal, buscando transações específicas:",
          usuario.id
        );
        try {
          transacoesResponse = await api.get(
            `/transacoes/usuario/${usuario.id}`,
            {
              headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log(
            "✅ Transações do usuário carregadas:",
            transacoesResponse.data.length
          );
        } catch (userTransactionsError: any) {
          console.warn("⚠️ Fallback para endpoint geral");
          transacoesResponse = await api.get("/transacoes", {
            headers: {
              Authorization: `Basic ${credentials}`,
              "Content-Type": "application/json",
            },
          });
          console.log(
            "✅ Transações gerais carregadas:",
            transacoesResponse.data.length
          );
        }
      }

      console.log(
        "📋 Dados das transações:",
        transacoesResponse.data.slice(0, 3)
      );

      console.log("🎉 Login realizado com sucesso!");

      return {
        credentials,
        user: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          papel: usuario.papel,
          ativo: usuario.ativo,
          dataCriacao: usuario.dataCriacao,
          dataAtualizacao: usuario.dataAtualizacao,
          ultimoAcesso: usuario.ultimoAcesso,
        },
        categorias: categoriasResponse.data,
        transacoes: transacoesResponse.data,
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
   * Fazer logout
   */
  static async logout(): Promise<void> {
    // Limpar dados do localStorage será feito pelo store
    console.log("🚪 Logout realizado");
  }

  /**
   * Validar token (verificar se usuário ainda está autenticado)
   */
  static async validateToken(): Promise<any> {
    const credentials = localStorage.getItem("token");

    if (!credentials) {
      console.log("🚫 Nenhum token encontrado para validação");
      throw new Error("Usuário não autenticado");
    }

    try {
      console.log("🔍 Validando token...");

      // Testar se as credenciais ainda são válidas fazendo uma requisição simples
      const response = await api.get("/categorias", {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      });

      console.log(
        "✅ Token válido - categorias acessíveis:",
        response.data.length
      );

      // Retornar dados básicos do usuário do localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        console.log("👤 Dados do usuário recuperados:", user.nome);
        return user;
      }

      console.warn("⚠️ Dados do usuário não encontrados no localStorage");
      return null;
    } catch (error: any) {
      console.error("❌ Erro na validação do token:", error);

      if (error.response?.status === 401) {
        console.log("🚫 Token inválido - credenciais expiradas ou incorretas");
      }

      throw new Error("Token inválido");
    }
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
      credentials: btoa("admin@financeiro.com:admin123"),
      user: {
        id: "test-id",
        nome: "Admin Sistema",
        email: "admin@financeiro.com",
        papel: "ADMIN",
        ativo: true,
        dataCriacao: new Date().toISOString(),
      },
      categorias: [],
      transacoes: [],
    };
  }
}
