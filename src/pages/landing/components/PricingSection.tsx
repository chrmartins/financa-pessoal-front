import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  "Transações ilimitadas",
  "Contas e categorias ilimitadas",
  "Relatórios avançados com gráficos",
  "Metas financeiras personalizadas",
  "Alertas personalizados por email",
  "Sincronização em tempo real",
  "Suporte prioritário por email",
  "Exportar dados (CSV/Excel)",
  "Controle compartilhado (família)",
  "Sem anúncios",
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-20 px-4 bg-gradient-to-b from-slate-900/50 to-slate-950"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Preço simples e transparente
          </h2>
          <p className="text-xl text-slate-400">
            Sem pegadinhas. Cancele quando quiser.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="relative">
            {/* Badge de destaque */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                🎉 PRIMEIRO MÊS GRÁTIS
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 rounded-2xl p-8 relative overflow-hidden mt-8">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                  }}
                ></div>
              </div>

              <div className="relative">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Plano Premium
                  </h3>
                  <p className="text-purple-100">
                    Acesso completo a todos os recursos
                  </p>
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl text-purple-200 line-through mr-3">
                      R$ 19,90
                    </span>
                    <span className="text-6xl font-bold text-white">R$ 9</span>
                    <span className="text-4xl font-bold text-white">,90</span>
                    <span className="text-purple-100 ml-2 text-xl">/mês</span>
                  </div>
                  <p className="text-purple-100 mt-3 text-lg font-medium">
                    Apenas{" "}
                    <span className="text-white font-bold">
                      R$ 0,33 por dia
                    </span>
                  </p>
                  <p className="text-purple-200 mt-2">
                    Após o primeiro mês gratuito
                  </p>
                </div>

                <Link
                  to="/login"
                  className="w-full bg-white hover:bg-slate-100 text-purple-700 px-8 py-4 rounded-xl transition font-bold text-lg flex items-center justify-center group mb-8 shadow-xl"
                >
                  Começar Teste Grátis de 30 Dias
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition" />
                </Link>

                <div className="space-y-3 mb-8">
                  {features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 text-white"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-300 flex-shrink-0" />
                      <span className="text-purple-50">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-purple-500/30">
                  <div className="space-y-2 text-sm text-purple-100 text-center">
                    <p className="flex items-center justify-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-300" />
                      <span>Sem cartão de crédito necessário para começar</span>
                    </p>
                    <p className="flex items-center justify-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-300" />
                      <span>Cancele quando quiser, sem multas</span>
                    </p>
                    <p className="flex items-center justify-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-300" />
                      <span>
                        Garantia de 7 dias - 100% do seu dinheiro de volta
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
