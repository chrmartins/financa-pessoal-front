import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Store para estado do usuário e autenticação
interface UserState {
  user: {
    id: number;
    nome: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
  setUser: (user: UserState["user"]) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        setUser: (user) =>
          set({ user, isAuthenticated: !!user }, false, "setUser"),
        logout: () =>
          set({ user: null, isAuthenticated: false }, false, "logout"),
      }),
      {
        name: "user-store",
      }
    ),
    { name: "user-store" }
  )
);
