import { BarChart3, TrendingUp } from "lucide-react";

export function DemoSection() {
  return (
    <section id="demo" className="py-20 px-4 bg-slate-900/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Veja como é simples
          </h2>
          <p className="text-xl text-slate-400">
            Interface intuitiva que você vai dominar em minutos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Dashboard Card */}
          <div className="group">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-purple-500/50 transition">
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Dashboard Completo
                  </h3>
                </div>
                <p className="text-slate-400">
                  Visualize todo seu panorama financeiro em um só lugar
                </p>
              </div>
              <img
                src="/images/dashboard-full.png"
                alt="Dashboard completo com resumo financeiro e gráficos"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Transactions Card */}
          <div className="group">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-green-500/50 transition">
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Gráficos Inteligentes
                  </h3>
                </div>
                <p className="text-slate-400">
                  Entenda seus padrões de gastos com visualizações claras
                </p>
              </div>
              <div className="p-8 bg-slate-900/50">
                <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-16 h-16 text-green-400/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
