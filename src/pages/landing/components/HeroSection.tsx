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

            <div className="flex flex-wrap items-center gap-8 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-slate-950"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-slate-950"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-slate-950"></div>
                </div>
                <span>+10.000 usuários</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★★★★★</span>
                <span>4.9/5</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Grátis para sempre</span>
              </div>
            </div>
          </div>

          {/* Right: Dashboard Screenshot */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-purple-500/10">
              <img
                src="/images/dashboard-preview.png"
                alt="Dashboard do NoControle mostrando resumo financeiro, gráficos e transações"
                className="w-full h-auto"
              />
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -left-4 top-1/4 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-xl animate-float">
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

            <div className="absolute -right-4 bottom-1/4 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-xl animate-float-delayed">
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
