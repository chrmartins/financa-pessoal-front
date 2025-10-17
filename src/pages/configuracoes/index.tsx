import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUserStore } from "@/stores/auth/use-user-store";
import { Bell, Moon, Shield, Sun, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ConfiguracoesPage() {
  const user = useUserStore((state) => state.user);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    toast.success(`Tema ${newTheme ? "escuro" : "claro"} ativado`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configurações
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Gerencie suas preferências e configurações de conta
          </p>
        </div>

        {/* Perfil do Usuário */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>Perfil do Usuário</CardTitle>
                <CardDescription>Suas informações pessoais</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  defaultValue={user?.nome}
                  placeholder="Seu nome completo"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email}
                  placeholder="seu@email.com"
                  disabled
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Conta verificada
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.papel}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Sun className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize a interface do sistema
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo Escuro</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Ative o tema escuro para reduzir o cansaço visual
                </p>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Gerencie suas preferências de notificações
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Gastos</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Receba alertas quando atingir limites de gastos
                </p>
              </div>
              <Switch disabled />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Lembretes de Transações</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Lembre-se de registrar suas transações recorrentes
                </p>
              </div>
              <Switch disabled />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Relatórios Mensais</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Receba um resumo financeiro no final de cada mês
                </p>
              </div>
              <Switch disabled />
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="text-center pb-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Versão 1.0.0 •{" "}
            <span className="text-purple-600 dark:text-purple-400">
              NoControle
            </span>
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            © 2025 • Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
