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
          set({ user, isAuthenticated }, false, "setUser");
          console.log("👤 Usuário atualizado:", {
            user: user?.nome,
            isAuthenticated,
          });
        },

        setToken: (token) => {
          set({ token }, false, "setToken");
          if (token) {
            localStorage.setItem("token", token);
            console.log("🔑 Token salvo no localStorage");
          } else {
            localStorage.removeItem("token");
            console.log("🗑️ Token removido do localStorage");
          }
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        // Fazer login
        login: async (email: string, password: string) => {
          const { setUser, setToken, setLoading } = get();

          setLoading(true);
          try {
            const response: LoginResponse = await AuthService.login(
              email,
              password
            );

            setUser(response.user);
            setToken(response.credentials);

            console.log("✅ Login realizado com sucesso");
          } catch (error) {
            console.error("❌ Erro no login:", error);
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
          const { setLoading, setUser, setToken } = get();

          setLoading(true);

          if (!token) {
            console.log("🚫 Nenhum token encontrado - usuário não autenticado");
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
            const user = await AuthService.validateToken();
            setUser(user);
            setToken(token);
            console.log("✅ Token validado com sucesso");
          } catch (error) {
            console.warn("🚫 Token inválido, fazendo logout");
            localStorage.removeItem("token");
            set(
              { user: null, isAuthenticated: false, token: null },
              false,
              "invalidToken"
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
if (typeof window !== "undefined") {
  setTimeout(() => {
    const store = useUserStore.getState();
    console.log("🚀 Inicializando verificação de autenticação...");
    store.validateToken();
  }, 100);
}
