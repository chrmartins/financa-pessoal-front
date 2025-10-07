import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "@/stores/auth/use-user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Eye, EyeOff, LogIn, Mail, Shield } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

// Schema de validação do formulário
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

type AuthLocationState = {
  from?: {
    pathname: string;
  };
};

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { isAuthenticated, login } = useUserStore();
  const location = useLocation();
  const locationState = location.state as AuthLocationState | null;
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // DEBUG: Log do estado de autenticação
  console.log("🔍 LOGIN RENDER - isAuthenticated:", isAuthenticated);
  console.log("🔍 LOGIN RENDER - location.pathname:", location.pathname);

  // Monitorar mudanças no isAuthenticated e redirecionar automaticamente
  const destination = useMemo(
    () => locationState?.from?.pathname ?? "/",
    [locationState]
  );

  useEffect(() => {
    if (isAuthenticated) {
      console.log(
        "🔄 useEffect - Detectou isAuthenticated=true, redirecionando para:",
        destination
      );
      // Pequeno delay para garantir que o estado foi persistido
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 100);
    }
  }, [destination, isAuthenticated, navigate]);

  // Se já está autenticado, redireciona (APÓS todos os hooks)
  if (isAuthenticated) {
    console.log(
      "✅ LOGIN - REDIRECIONANDO! isAuthenticated=true, destino:",
      destination
    );
    return <Navigate to={destination} replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    console.log("🚀 LOGIN SUBMIT - Iniciando...");
    console.log("📧 LOGIN SUBMIT - Email:", data.email);

    setIsLoading(true);
    setLoginError(null);

    try {
      console.log("📞 LOGIN SUBMIT - Chamando login()...");
      await login(data.email, data.password);

      console.log("✅ LOGIN SUBMIT - login() completou com sucesso!");

      // Verificar estado após login
      const currentState = useUserStore.getState();
      console.log("🔍 LOGIN SUBMIT - Estado após login:", {
        isAuthenticated: currentState.isAuthenticated,
        user: currentState.user?.nome,
        hasToken: !!currentState.token,
      });

      // Redirecionamento manual após login bem-sucedido
      console.log("🚀 LOGIN SUBMIT - Navegando para:", destination);
      navigate(destination, { replace: true });
    } catch (error: unknown) {
      console.error("❌ LOGIN SUBMIT - Erro no login:", error);

      const message = isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
        ? error.message
        : "Erro ao fazer login. Verifique suas credenciais.";

      setLoginError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Bem-vindo de volta!
          </CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="seu@email.com"
                        autoComplete="email"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Senha
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Sua senha"
                          autoComplete="current-password"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {loginError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {loginError}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Não tem uma conta?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-blue-600"
              >
                Criar conta
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
