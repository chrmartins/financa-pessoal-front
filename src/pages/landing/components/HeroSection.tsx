import { ArrowRight, CheckCircle2, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full text-sm font-medium border border-purple-500/20">
                ✨ Primeiro mês GRÁTIS
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Controle suas finanças em{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-green-400">
                5 minutos
              </span>{" "}
              por dia
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed">
              Gerencie despesas, economize dinheiro e alcance suas metas
              financeiras com o sistema mais simples e intuitivo do Brasil.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/login"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg transition font-semibold text-lg flex items-center justify-center group shadow-lg shadow-purple-500/30"
              >
                Começar Grátis Agora
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition" />
              </Link>

              <a
                href="#demo"
                className="border-2 border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-lg transition font-semibold text-lg text-center"
              >
                Ver Demonstração
              </a>
            </div>

          </div>

          {/* Right: Dashboard Preview */}
          <div className="relative">
            {/* Dashboard Mockup */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-purple-500/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Dashboard
                  </h3>
                  <p className="text-slate-400 text-sm">Resumo financeiro</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-slate-400 text-xs mb-1">Receitas</p>
                  <p className="text-green-400 font-bold text-xl">R$ 5.240</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-slate-400 text-xs mb-1">Despesas</p>
                  <p className="text-red-400 font-bold text-xl">R$ 3.120</p>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 mb-4">
                <div className="flex items-end justify-between h-32 gap-2">
                  <div
                    className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                    style={{ height: "60%" }}
                  ></div>
                  <div
                    className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                    style={{ height: "80%" }}
                  ></div>
                  <div
                    className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t"
                    style={{ height: "95%" }}
                  ></div>
                  <div
                    className="flex-1 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t"
                    style={{ height: "70%" }}
                  ></div>
                  <div
                    className="flex-1 bg-gradient-to-t from-pink-600 to-pink-400 rounded-t"
                    style={{ height: "85%" }}
                  ></div>
                </div>
              </div>

              {/* Transactions */}
              <div className="space-y-2">
                {[
                  {
                    icon: "🛒",
                    name: "Mercado",
                    value: "-R$ 245,00",
                    color: "text-red-400",
                  },
                  {
                    icon: "💰",
                    name: "Salário",
                    value: "+R$ 5.240,00",
                    color: "text-green-400",
                  },
                  {
                    icon: "🏠",
                    name: "Aluguel",
                    value: "-R$ 1.200,00",
                    color: "text-red-400",
                  },
                ].map((transaction, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{transaction.icon}</span>
                      <span className="text-slate-300 text-sm">
                        {transaction.name}
                      </span>
                    </div>
                    <span className={`font-semibold ${transaction.color}`}>
                      {transaction.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -left-8 top-16 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-xl animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Economia este mês</p>
                  <p className="text-xl font-bold text-white">+R$ 1.250</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 bottom-16 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-xl animate-float-delayed">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Meta atingida</p>
                  <p className="text-xl font-bold text-white">87%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
