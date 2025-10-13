import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home, Search, TrendingDown, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2 shadow-2xl">
        <CardContent className="pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-6 text-center">
          {/* Ilustração com ícones */}
          <div className="relative mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
              <Wallet className="h-12 w-12 sm:h-20 sm:w-20 text-green-500 animate-bounce" />
              <TrendingDown className="h-16 w-16 sm:h-24 sm:w-24 text-red-500 animate-pulse" />
              <Search className="h-12 w-12 sm:h-20 sm:w-20 text-blue-500 animate-bounce delay-150" />
            </div>

            {/* Número 404 grande e estilizado */}
            <h1 className="text-7xl sm:text-9xl font-bold bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              404
            </h1>
          </div>

          {/* Mensagem principal */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground px-2">
              Página não encontrada
            </h2>
          </div>

          {/* Sugestões */}
          <div className="bg-muted/50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-left">
            <p className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm sm:text-base">
              <span className="text-lg sm:text-xl">💡</span>
              Algumas sugestões para você:
            </p>
            <ul className="space-y-2 text-muted-foreground text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Verifique se o endereço está correto</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Volte para a página inicial e tente novamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Confira suas transações e categorias no dashboard</span>
              </li>
            </ul>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 sm:mb-0">
            <Button
              size="lg"
              onClick={() => navigate(-1)}
              variant="outline"
              className="gap-2 w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="gap-2 w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              <Home className="h-4 w-4" />
              Ir para o Dashboard
            </Button>
          </div>

          {/* Mensagem extra descontraída */}
          <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground italic px-2">
            "Nem toda despesa é planejada, mas toda jornada tem um caminho de
            volta!" 💰
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
