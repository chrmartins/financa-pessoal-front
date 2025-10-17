import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/auth/use-user-store";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Declaração do tipo global para o Google
interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

interface GoogleButtonConfig {
  theme: string;
  size: string;
  text: string;
  locale: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleConfig) => void;
          renderButton: (
            element: HTMLElement,
            config: GoogleButtonConfig
          ) => void;
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

  const handleCredentialResponse = useCallback(
    async (response: GoogleCredentialResponse) => {
      try {
        setIsLoading(true);

        // Usar o serviço de autenticação para fazer login com Google
        await loginWithGoogle(response.credential);

        toast.success("Login realizado com sucesso!", {
          description: "Bem-vindo(a) de volta!",
          duration: 1500,
        });

        // Redirecionar imediatamente após o login (o estado já foi atualizado)
        navigate("/dashboard", { replace: true });
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
    },
    [loginWithGoogle, navigate]
  );

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
  }, [isScriptLoaded, handleCredentialResponse]);

  if (!isScriptLoaded) {
    return (
      <Button type="button" variant="outline" className="w-full" disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Carregando Google...
      </Button>
    );
  }

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex items-center justify-center p-3 border rounded-md">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Autenticando...
        </div>
      )}
      <div
        id="google-signin-button"
        className={isLoading ? "hidden" : ""}
        style={{ width: "100%" }}
      />
    </div>
  );
}
