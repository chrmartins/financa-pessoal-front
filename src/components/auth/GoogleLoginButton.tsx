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

    // Renderizar o botão do Google
    const buttonDiv = document.getElementById("google-signin-button");
    if (buttonDiv) {
      window.google.accounts.id.renderButton(buttonDiv, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        locale: "pt-BR",
      });
    }
  }, [isScriptLoaded]);

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
    <div className="w-full relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm rounded-md">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Autenticando com Google...
            </p>
          </div>
        </div>
      )}
      <div
        id="google-signin-button"
        className="w-full"
        style={{ width: "100%" }}
      />
    </div>
  );
}
