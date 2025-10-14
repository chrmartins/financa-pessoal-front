import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
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
import { useSEO } from "@/hooks/use-seo";
import { useUserStore } from "@/stores/auth/use-user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Eye, EyeOff, LogIn, Mail } from "lucide-react";
import { useMemo, useState } from "react";
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
  // SEO otimizado para a página de login
  useSEO({
    title: "Login - NControle | Sistema de Controle Financeiro Pessoal",
    description:
      "Acesse sua conta NControle e gerencie suas finanças pessoais. Login rápido e seguro com Google ou email. Controle total das suas despesas e receitas.",
    keywords:
      "login controle financeiro, acessar conta financeira, entrar sistema financeiro, login gestão de gastos",
    url: "https://www.ncontrole.com.br/login",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { isAuthenticated, isHydrated, login } = useUserStore();
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

  // Calcular destino do redirecionamento
  const destination = useMemo(
    () => locationState?.from?.pathname ?? "/dashboard",
    [locationState]
  );

  // Mostrar loading enquanto hidrata o estado do localStorage
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // Se já está autenticado, redireciona imediatamente
  if (isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      await login(data.email, data.password);

      // Redirecionamento manual após login bem-sucedido
      navigate(destination, { replace: true });
    } catch (error: unknown) {
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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 text-center space-y-6 max-w-md">
          <Logo size="large" />
          <h1 className="text-4xl font-bold text-white mt-8">
            Controle Total das Suas Finanças
          </h1>
          <p className="text-xl text-blue-100">
            Gerencie receitas, despesas e alcance suas metas financeiras com
            simplicidade.
          </p>

          {/* Features */}
          <div className="mt-12 space-y-4 text-left">
            {[
              { icon: "📊", text: "Dashboard completo e intuitivo" },
              { icon: "💰", text: "Controle de receitas e despesas" },
              { icon: "📈", text: "Relatórios detalhados" },
              { icon: "🔒", text: "Seus dados sempre seguros" },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-white">
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-lg">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Logo size="large" />
          </div>

          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bem-vindo de volta!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Entre com suas credenciais para acessar sua conta
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                      <FormLabel>Senha</FormLabel>
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

                {/* Divisor */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ou continue com
                    </span>
                  </div>
                </div>

                {/* Botão de login com Google */}
                <GoogleLoginButton />
              </form>
            </Form>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              Não tem uma conta?{" "}
              <a
                href="/#pricing"
                className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400"
              >
                Comece grátis
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
