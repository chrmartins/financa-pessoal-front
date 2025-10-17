import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/auth/use-user-store";
import { useUIStore } from "@/stores/ui/use-ui-store";
import { cn } from "@/utils";
import { SpeedInsights } from "@vercel/speed-insights/react";
import {
  CreditCard,
  Home,
  LogOut,
  Menu,
  Settings,
  Tags,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { Logo } from "./logo.tsx";

interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
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
    title: "Usuários",
    href: "/usuarios",
    icon: Users,
    adminOnly: true, // Apenas ADMIN pode gerenciar usuários (CRUD)
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
    "/dashboard": {
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
    "/usuarios": {
      title: "Usuários",
      description: "Gerencie os usuários do sistema",
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

  return routes[pathname as keyof typeof routes] || routes["/dashboard"];
}

// Componente para exibir perfil do usuário
function UserProfile() {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      setShowMenu(false);
      toast.success("Logout realizado com sucesso!");
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout. Tente novamente.");
    }
  };

  // Debug: verificar se foto está vindo
  console.log("🔍 LAYOUT DEBUG - Usuário:", user);
  console.log("🔍 LAYOUT DEBUG - Foto perfil:", user?.fotoPerfil);

  return (
    <div className="relative flex items-center gap-3">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-md overflow-hidden">
          {user?.fotoPerfil ? (
            <img
              src={user.fotoPerfil}
              alt={user.nome || "Usuário"}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-sm font-semibold text-white">
              {user?.nome ? getInitials(user.nome) : "U"}
            </span>
          )}
        </div>
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-none">
            {user?.nome || "Usuário"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {user?.email || "email@example.com"}
          </span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            {/* User Info Header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user?.nome || "Usuário"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || "email@example.com"}
              </p>
              {user?.papel && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {user.papel}
                </span>
              )}
            </div>

            {/* Menu Options */}
            <div className="p-2">
              <Link
                to="/configuracoes"
                onClick={() => setShowMenu(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <Settings className="h-4 w-4" />
                Configurações
              </Link>

              <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function Layout() {
  const { sidebarOpen, toggleSidebar, isMobile, setIsMobile } = useUIStore();
  const { user } = useUserStore();
  const location = useLocation();
  const pageInfo = getPageInfo(location.pathname);

  // Detectar se está em modo mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    // Verificar na montagem
    checkMobile();

    // Adicionar listener para resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsMobile]);

  // Filtrar itens do menu baseado no papel do usuário
  const filteredMenuItems = menuItems.filter((item) => {
    // Se o item não tem restrição, mostra para todos
    if (!item.adminOnly) return true;
    // Se tem restrição, só mostra para ADMIN
    return user?.papel === "ADMIN";
  });

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
          <div className="h-16 border-b border-white/10 dark:border-gray-700/30 relative grid place-items-center">
            <Logo />
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="lg:hidden absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {filteredMenuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => {
                    // Fecha a sidebar no mobile ao clicar em um item
                    if (isMobile && sidebarOpen) {
                      toggleSidebar();
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-primary text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gradient-primary hover:text-white hover:shadow-lg"
                  )}
                >
                  <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  {item.title}
                </Link>
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
              <UserProfile />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 py-3 sm:py-4 md:py-6 lg:py-8 transition-page">
          {/* Container automático - páginas podem sobrescrever se necessário */}
          <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-4 md:px-6 lg:px-8">
            <Outlet /> {/* Renderiza as rotas filhas */}
          </div>
          <SpeedInsights />
        </main>
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
