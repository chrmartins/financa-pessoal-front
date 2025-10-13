import { Button } from "@/components/ui/button";
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

      // Enviar o credential (JWT token) para o backend
      const apiResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: response.credential,
          }),
        }
      );

      if (!apiResponse.ok) {
        throw new Error("Falha na autenticação");
      }

      const data = await apiResponse.json();

      // Salvar token JWT no localStorage
      localStorage.setItem("token", data.token);

      toast.success(`Bem-vindo(a), ${data.nome}!`, {
        description: "Login realizado com sucesso",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      toast.error("Erro ao fazer login", {
        description:
          "Não foi possível autenticar com o Google. Tente novamente.",
      });
    } finally {
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
