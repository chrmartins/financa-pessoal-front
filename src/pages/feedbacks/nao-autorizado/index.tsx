import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/auth/use-user-store";
import { Home, Lock, LogOut, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NaoAutorizadoPage() {
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Main Content */}
        <div className="relative">
          {/* Icon Container */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Pulsing Ring */}
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>

              {/* Main Icon Background */}
              <div className="relative w-32 h-32 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50">
                <ShieldAlert
                  className="w-16 h-16 text-white"
                  strokeWidth={1.5}
                />
              </div>

              {/* Lock Badge */}
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-slate-900 border-4 border-slate-800 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>

          {/* Error Code */}
          <div className="text-center mb-6">
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500 mb-4 animate-gradient">
              403
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Acesso Negado
            </h2>
            <p className="text-lg text-slate-400 max-w-md mx-auto">
              Você não tem permissão para acessar este recurso.
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">
                      Permissão Negada
                    </h3>
                    <p className="text-sm text-slate-400 mb-3">
                      Olá,{" "}
                      <span className="text-white font-medium">
                        {user.nome}
                      </span>
                      ! Você está autenticado, mas não possui as permissões
                      necessárias para acessar este recurso.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="px-2 py-1 bg-slate-800 rounded">
                        Cargo: {user.papel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">
                    Sessão Expirada
                  </h3>
                  <p className="text-sm text-slate-400">
                    Sua sessão pode ter expirado. Faça login novamente para
                    continuar.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGoHome}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 text-base font-semibold shadow-lg shadow-purple-500/30 group"
            >
              <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Ir para o Início
            </Button>

            {user && (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex-1 border-slate-700 hover:border-slate-600 text-white hover:bg-slate-800 h-12 text-base font-semibold group"
              >
                <LogOut className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Sair da Conta
              </Button>
            )}

            {!user && (
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="flex-1 border-slate-700 hover:border-slate-600 text-white hover:bg-slate-800 h-12 text-base font-semibold"
              >
                Fazer Login
              </Button>
            )}
          </div>

          {/* Help Text */}
          <div className="text-center mt-8">
            <p className="text-sm text-slate-500">
              Precisa de ajuda?{" "}
              <a
                href="mailto:suporte@nocontrole.com"
                className="text-purple-400 hover:text-purple-300 transition-colors underline"
              >
                Entre em contato com o suporte
              </a>
            </p>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes gradient {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
        `}
      </style>
    </div>
  );
}
