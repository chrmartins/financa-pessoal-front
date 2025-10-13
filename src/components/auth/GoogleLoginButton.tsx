import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/auth/use-user-store";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Declaração do tipo global para o Google
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export function GoogleLoginButton() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Carregar o script do Google Identity Services
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!isScriptLoaded || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
  }, [isScriptLoaded]);

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  const handleCredentialResponse = async (response: any) => {
    try {
      setIsLoading(true);

      // Usar o serviço de autenticação para fazer login com Google
      await loginWithGoogle(response.credential);

      toast.success("Login realizado com sucesso!", {
        description: "Redirecionando para o dashboard...",
        duration: 2000,
      });

      // Pequeno delay para garantir que o toast seja visto antes do redirect
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      toast.error("Erro ao fazer login", {
        description:
          error instanceof Error
            ? error.message
            : "Não foi possível autenticar com o Google. Tente novamente.",
      });
      setIsLoading(false);
    }
  };

  if (!isScriptLoaded) {
    return (
      <Button type="button" variant="outline" className="w-full" disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Carregando Google...
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full relative h-11 font-medium hover:bg-gray-50 dark:hover:bg-gray-900"
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-gray-700 dark:text-gray-300">
            Autenticando com Google...
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-gray-700 dark:text-gray-200">
            Continuar com o Google
          </span>
        </div>
      )}
    </Button>
  );
}
