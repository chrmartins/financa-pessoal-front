import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Store para UI/Theme
interface UIState {
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        theme: "system",
        sidebarOpen: false,
        isMobile: false,
        toggleSidebar: () =>
          set(
            (state) => ({ sidebarOpen: !state.sidebarOpen }),
            false,
            "toggleSidebar"
          ),
        setTheme: (theme) => set({ theme }, false, "setTheme"),
        setIsMobile: (isMobile) => set({ isMobile }, false, "setIsMobile"),
      }),
      {
        name: "ui-store",
        partialize: (state) => ({ theme: state.theme }),
      }
    ),
    { name: "ui-store" }
  )
);
