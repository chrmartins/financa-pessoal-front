import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, CreditCard, Lock, Shield, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

export function Assinatura() {
  const [showPagamento, setShowPagamento] = useState(false);

  // Mock data - substituir com useTrialStatus depois
  const trialExpirado = false;
  const diasRestantes: number = 15;

  return (
    // Container marketing (1200px) - melhor para páginas de venda
    <div className="max-w-[1200px] mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">
            {trialExpirado
              ? "Continue com o Premium"
              : "Assine o Plano Premium"}
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {trialExpirado
            ? "Seu trial de 30 dias terminou. Continue aproveitando todos os recursos!"
            : `Você ainda tem ${diasRestantes} ${
                diasRestantes === 1 ? "dia" : "dias"
              } de trial gratuito`}
        </p>
      </div>

      {/* Alerta de Trial Expirado */}
      {trialExpirado && (
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            <strong>Acesso Bloqueado:</strong> Seu período de teste gratuito
            terminou. Para continuar usando o sistema, assine o plano Premium
            por apenas <strong>R$ 9,90/mês</strong>.
          </AlertDescription>
        </Alert>
      )}

      {/* Card do Plano Principal */}
      <Card className="border-2 border-primary shadow-lg">
        <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Plano Premium
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Controle total das suas finanças
              </CardDescription>
            </div>
            <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm">
              Melhor Custo-Benefício
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Preço em Destaque */}
          <div className="text-center py-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
            <div className="text-5xl font-bold text-primary">R$ 9,90</div>
            <div className="text-muted-foreground mt-1">por mês</div>
            <div className="text-xs text-muted-foreground mt-2">
              Cancele quando quiser • Sem taxas extras
            </div>
          </div>

          {/* Recursos em 2 Colunas */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Recursos Principais
              </h3>
              {[
                "Transações ilimitadas",
                "Categorias personalizadas",
                "Relatórios detalhados",
                "Gráficos avançados",
              ].map((recurso, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{recurso}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Recursos Extras
              </h3>
              {[
                "Exportação PDF e Excel",
                "Importação de extratos",
                "Metas financeiras",
                "Suporte prioritário",
              ].map((recurso, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{recurso}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botão de Ação Principal */}
          <Button
            size="lg"
            className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={() => setShowPagamento(true)}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            {trialExpirado
              ? "Desbloquear Acesso Agora"
              : "Garantir Acesso Premium"}
          </Button>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-4 border-t">
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-600" />
              <span>Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Pagamento seguro</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Garantias */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="text-center p-4">
          <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
          <h4 className="font-semibold mb-1">100% Seguro</h4>
          <p className="text-xs text-muted-foreground">
            Pagamentos processados pelo Stripe, a plataforma mais segura do
            mundo
          </p>
        </Card>

        <Card className="text-center p-4">
          <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
          <h4 className="font-semibold mb-1">Ativação Instantânea</h4>
          <p className="text-xs text-muted-foreground">
            Acesso liberado automaticamente após confirmação do pagamento
          </p>
        </Card>

        <Card className="text-center p-4">
          <Check className="w-8 h-8 text-primary mx-auto mb-2" />
          <h4 className="font-semibold mb-1">Sem Compromisso</h4>
          <p className="text-xs text-muted-foreground">
            Cancele quando quiser, sem multas ou taxas de cancelamento
          </p>
        </Card>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-1">Como funciona o pagamento?</h4>
            <p className="text-sm text-muted-foreground">
              Cobramos R$ 9,90 mensalmente no cartão cadastrado. A renovação é
              automática, mas você pode cancelar a qualquer momento.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">
              Posso cancelar quando quiser?
            </h4>
            <p className="text-sm text-muted-foreground">
              Sim! Não há período de fidelidade. Cancele quando quiser nas
              configurações da sua conta, sem custos adicionais.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">Meus dados estão seguros?</h4>
            <p className="text-sm text-muted-foreground">
              Sim! Utilizamos o Stripe, uma das plataformas de pagamento mais
              seguras do mundo. Não armazenamos dados do seu cartão em nossos
              servidores.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">
              O que acontece se eu não pagar?
            </h4>
            <p className="text-sm text-muted-foreground">
              Seu acesso será bloqueado, mas todos os seus dados permanecerão
              salvos por 90 dias. Ao reativar a assinatura, você recupera tudo
              automaticamente.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">
              Posso mudar de cartão depois?
            </h4>
            <p className="text-sm text-muted-foreground">
              Sim! Você pode atualizar ou trocar o cartão de pagamento a
              qualquer momento nas configurações da sua conta.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Pagamento - implementar depois */}
      {showPagamento && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Pagamento</CardTitle>
              <CardDescription>
                Modal de pagamento será implementado aqui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowPagamento(false)}
                className="w-full"
              >
                Fechar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
