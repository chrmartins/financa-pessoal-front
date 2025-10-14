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
  isHydrated: boolean; // Indica se o estado foi restaurado do localStorage
  setUser: (user: UserState["user"]) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (googleToken: string) => Promise<void>;
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
        isHydrated: false,

        setUser: (user) => {
          const isAuthenticated = !!user;
          set({ user, isAuthenticated }, false, "setUser");
        },

        setToken: (token) => {
          set({ token }, false, "setToken");
          // Token JWT agora é gerenciado diretamente pelo AuthService no localStorage
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setHydrated: (isHydrated) => set({ isHydrated }, false, "setHydrated"),

        // Fazer login com JWT
        login: async (email: string, password: string) => {
          const { setUser, setToken, setLoading } = get();

          setLoading(true);
          try {
            const response: LoginResponse = await AuthService.login(
              email,
              password
            );

            setUser(response.user);

            setToken(response.token);
          } catch (error) {
            console.error("❌ STORE - Erro no login:", error);
            throw error;
          } finally {
            setLoading(false);
          }
        },

        // Fazer login com Google OAuth
        loginWithGoogle: async (googleToken: string) => {
          const { setUser, setToken, setLoading } = get();

          setLoading(true);
          try {
            const response: LoginResponse = await AuthService.loginWithGoogle(
              googleToken
            );

            setUser(response.user);
            setToken(response.token);
          } catch (error) {
            console.error("❌ STORE - Erro no login com Google:", error);
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

          setLoading(true);

          if (!token || !usuarioData) {
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
        // Não persistir isLoading e isHydrated
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          token: state.token,
        }),
        onRehydrateStorage: () => (state) => {
          // Marcar como hidratado após restaurar do localStorage
          if (state) {
            state.setHydrated(true);
          }
        },
      }
    ),
    { name: "user-store" }
  )
);

// Inicializar verificação de autenticação ao carregar a aplicação
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  const usuarioData = localStorage.getItem("usuario");

  // Só validar se houver dados no localStorage
  if (token && usuarioData) {
    setTimeout(() => {
      const store = useUserStore.getState();
      store.validateToken();
    }, 0); // Executar imediatamente no próximo tick
  } else {
    // Se não houver dados, marcar como hidratado imediatamente
    useUserStore.getState().setHydrated(true);
  }
}
