import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores";
import { cn } from "@/utils";
import {
  CreditCard,
  Home,
  Menu,
  Settings,
  Tags,
  TrendingUp,
  X,
} from "lucide-react";
import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Logo } from "./logo.tsx";

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Transações",
    href: "/transacoes",
    icon: CreditCard,
  },
  {
    title: "Categorias",
    href: "/categorias",
    icon: Tags,
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: TrendingUp,
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
];

// Função para obter título e descrição baseado na rota
function getPageInfo(pathname: string) {
  const routes = {
    "/": {
      title: "Dashboard",
      description: "Gerencie suas finanças pessoais",
    },
    "/transacoes": {
      title: "Transações",
      description: "Gerencie todas as suas transações",
    },
    "/categorias": {
      title: "Categorias",
      description: "Organize suas categorias",
    },
    "/relatorios": {
      title: "Relatórios",
      description: "Visualize seus relatórios financeiros",
    },
    "/configuracoes": {
      title: "Configurações",
      description: "Configure suas preferências",
    },
  };

  return routes[pathname as keyof typeof routes] || routes["/"];
}

export function Layout({ children }: LayoutProps) {
  const { sidebarOpen, toggleSidebar, isMobile } = useUIStore();
  const location = useLocation();
  const pageInfo = getPageInfo(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Sidebar Backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 transform bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/50 transition-transform duration-300 ease-in-out shadow-2xl",
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-white/10 dark:border-gray-700/30">
            <Logo />
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-primary text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gradient-primary hover:text-white hover:shadow-lg"
                  )}
                >
                  <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  {item.title}
                </a>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 dark:border-gray-700/30">
            <div className="rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-400/10 dark:to-pink-400/10 p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                Finanças Pessoais v1.0
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          isMobile ? "ml-0" : "ml-64"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 px-4 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn("lg:hidden")}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Header Content */}
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {pageInfo.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                {pageInfo.description}
              </p>
            </div>

            {/* User Profile and Theme Toggle */}
            <div className="flex items-center gap-3">
              <ModeToggle />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-sm font-medium text-white">U</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                  Usuário
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "white",
            color: "#374151",
            border: "1px solid #e5e7eb",
            boxShadow:
              "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          },
        }}
      />
    </div>
  );
}
