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
              <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800">
                {/* Mockup do Dashboard */}
                <div className="space-y-4">
                  {/* Cards de Resumo */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                      <p className="text-slate-400 text-xs mb-1">Saldo</p>
                      <p className="text-blue-400 font-bold text-lg">
                        R$ 2.120
                      </p>
                      <p className="text-green-400 text-xs">+15%</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                      <p className="text-slate-400 text-xs mb-1">Receitas</p>
                      <p className="text-green-400 font-bold text-lg">
                        R$ 5.240
                      </p>
                      <p className="text-green-400 text-xs">+5%</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                      <p className="text-slate-400 text-xs mb-1">Despesas</p>
                      <p className="text-red-400 font-bold text-lg">R$ 3.120</p>
                      <p className="text-red-400 text-xs">-8%</p>
                    </div>
                  </div>

                  {/* Gráfico */}
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex items-end justify-between h-24 gap-2">
                      {[60, 80, 95, 70, 85, 90].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Transações */}
                  <div className="space-y-2">
                    {[
                      {
                        icon: "💰",
                        name: "Salário",
                        value: "+R$ 5.240",
                        color: "text-green-400",
                      },
                      {
                        icon: "🏠",
                        name: "Aluguel",
                        value: "-R$ 1.200",
                        color: "text-red-400",
                      },
                      {
                        icon: "🛒",
                        name: "Mercado",
                        value: "-R$ 245",
                        color: "text-red-400",
                      },
                    ].map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-slate-800/50 rounded-lg p-2 border border-slate-700/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{t.icon}</span>
                          <span className="text-slate-300 text-sm">
                            {t.name}
                          </span>
                        </div>
                        <span className={`font-semibold text-sm ${t.color}`}>
                          {t.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
              <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                  {/* Header do Gráfico */}
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-semibold">
                      Tendência - 6 meses
                    </h4>
                    <span className="text-green-400 text-sm">+22%</span>
                  </div>

                  {/* Gráfico de Linha Simulado */}
                  <div className="relative h-40">
                    <svg viewBox="0 0 300 100" className="w-full h-full">
                      {/* Grid Lines */}
                      <line
                        x1="0"
                        y1="25"
                        x2="300"
                        y2="25"
                        stroke="#334155"
                        strokeWidth="1"
                        opacity="0.3"
                      />
                      <line
                        x1="0"
                        y1="50"
                        x2="300"
                        y2="50"
                        stroke="#334155"
                        strokeWidth="1"
                        opacity="0.3"
                      />
                      <line
                        x1="0"
                        y1="75"
                        x2="300"
                        y2="75"
                        stroke="#334155"
                        strokeWidth="1"
                        opacity="0.3"
                      />

                      {/* Gradient Area com Blur/Shadow */}
                      <defs>
                        {/* Gradiente para a área preenchida */}
                        <linearGradient
                          id="chartGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#10b981"
                            stopOpacity="0.4"
                          />
                          <stop
                            offset="100%"
                            stopColor="#10b981"
                            stopOpacity="0.05"
                          />
                        </linearGradient>

                        {/* Filtro de blur para criar sombra suave */}
                        <filter
                          id="glow"
                          x="-50%"
                          y="-50%"
                          width="200%"
                          height="200%"
                        >
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feFlood floodColor="#10b981" floodOpacity="0.5" />
                          <feComposite in2="blur" operator="in" />
                          <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Area under line com gradiente */}
                      <path
                        d="M 0 80 L 50 70 L 100 60 L 150 50 L 200 40 L 250 30 L 300 20 L 300 100 L 0 100 Z"
                        fill="url(#chartGradient)"
                      />

                      {/* Line com efeito de brilho/sombra */}
                      <path
                        d="M 0 80 L 50 70 L 100 60 L 150 50 L 200 40 L 250 30 L 300 20"
                        stroke="#10b981"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                      />

                      {/* Points com brilho */}
                      {[
                        { x: 0, y: 80 },
                        { x: 50, y: 70 },
                        { x: 100, y: 60 },
                        { x: 150, y: 50 },
                        { x: 200, y: 40 },
                        { x: 250, y: 30 },
                        { x: 300, y: 20 },
                      ].map((point, i) => (
                        <g key={i}>
                          {/* Círculo externo (brilho) */}
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="8"
                            fill="#10b981"
                            opacity="0.2"
                          />
                          {/* Círculo do meio */}
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            fill="#10b981"
                            opacity="0.6"
                          />
                          {/* Círculo central */}
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="3"
                            fill="#10b981"
                            stroke="#0f172a"
                            strokeWidth="1.5"
                          />
                        </g>
                      ))}
                    </svg>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
                    {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"].map(
                      (month, i) => (
                        <span key={i}>{month}</span>
                      )
                    )}
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
