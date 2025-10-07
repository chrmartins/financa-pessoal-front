import { AuthService, type LoginResponse } from "@/services/auth/auth-service";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Store para estado do usuário e autenticação
interface UserState {
  user: {
    id: string;
    nome: string;
    email: string;
    papel?: string;
    ativo?: boolean;
    dataCriacao?: string;
    dataAtualizacao?: string;
    ultimoAcesso?: string;
  } | null;
  isAuthenticated: boolean;
  token: string | null; // Armazena credenciais Basic Auth (Base64)
  isLoading: boolean;
  setUser: (user: UserState["user"]) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  validateToken: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        token: null,
        isLoading: false,

        setUser: (user) => {
          const isAuthenticated = !!user;
          console.log("👤 STORE setUser - Atualizando usuário:", {
            user: user?.nome,
            isAuthenticated,
          });
          set({ user, isAuthenticated }, false, "setUser");

          // Verificar se foi persistido
          setTimeout(() => {
            const stored = localStorage.getItem("user-store");
            console.log("💾 STORE setUser - Dados persistidos:", stored);
          }, 100);
        },

        setToken: (token) => {
          set({ token }, false, "setToken");
          // Token JWT agora é gerenciado diretamente pelo AuthService no localStorage
          console.log("� Token atualizado no estado");
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        // Fazer login com JWT
        login: async (email: string, password: string) => {
          const { setUser, setToken, setLoading } = get();

          console.log("🏪 STORE - Iniciando login...");
          setLoading(true);
          try {
            console.log("📞 STORE - Chamando AuthService.login...");
            const response: LoginResponse = await AuthService.login(
              email,
              password
            );

            console.log("📥 STORE - Resposta recebida:", response);
            console.log("👤 STORE - Setando usuário:", response.user.nome);
            setUser(response.user);

            console.log("🔑 STORE - Setando token");
            setToken(response.token);

            console.log("✅ STORE - Login realizado com sucesso");
            console.log("🔑 STORE - JWT Token armazenado");

            // Verificar estado final
            const finalState = get();
            console.log("🔍 STORE - Estado final:", {
              isAuthenticated: finalState.isAuthenticated,
              user: finalState.user?.nome,
              hasToken: !!finalState.token,
            });
          } catch (error) {
            console.error("❌ STORE - Erro no login:", error);
            throw error;
          } finally {
            setLoading(false);
          }
        },

        // Fazer logout
        logout: async () => {
          const { setLoading } = get();

          setLoading(true);
          try {
            await AuthService.logout();
            console.log("👋 Logout realizado com sucesso");
          } catch (error) {
            console.warn("⚠️ Erro no logout:", error);
          } finally {
            set(
              { user: null, isAuthenticated: false, token: null },
              false,
              "logout"
            );
            setLoading(false);
          }
        },

        // Validar token ao inicializar
        validateToken: async () => {
          const token = localStorage.getItem("token");
          const usuarioData = localStorage.getItem("usuario");
          const { setLoading, setUser, setToken } = get();

          console.log("🔍 validateToken - Verificando localStorage...");
          console.log("🔍 validateToken - Token existe:", !!token);
          console.log("🔍 validateToken - Usuario existe:", !!usuarioData);

          setLoading(true);

          if (!token || !usuarioData) {
            console.log(
              "🚫 validateToken - Nenhum token ou usuário encontrado"
            );
            set(
              {
                user: null,
                isAuthenticated: false,
                token: null,
                isLoading: false,
              },
              false,
              "noToken"
            );
            return;
          }

          try {
            // Parsear dados do usuário do localStorage
            const user = JSON.parse(usuarioData);

            // SIMPLIFICADO: Apenas restaurar do localStorage, não validar com API
            // (a validação acontecerá na primeira requisição protegida)
            setUser(user);
            setToken(token);
            console.log("✅ validateToken - Estado restaurado do localStorage");
          } catch (error: unknown) {
            console.error("❌ validateToken - Erro ao parsear usuário:", error);
            set(
              {
                user: null,
                isAuthenticated: false,
                token: null,
              },
              false,
              "invalidData"
            );
          } finally {
            setLoading(false);
          }
        },
      }),
      {
        name: "user-store",
        // Não persistir isLoading
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          token: state.token,
        }),
      }
    ),
    { name: "user-store" }
  )
);

// Inicializar verificação de autenticação
// DESABILITADO TEMPORARIAMENTE - causando conflito com login
// if (typeof window !== "undefined") {
//   setTimeout(() => {
//     const store = useUserStore.getState();
//     console.log("🚀 Inicializando verificação de autenticação...");
//     store.validateToken();
//   }, 100);
// }
