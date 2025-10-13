import {
  BarChart3,
  Bell,
  Lock,
  Smartphone,
  TrendingUp,
  Users,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Relatórios Visuais",
    description:
      "Gráficos interativos que mostram para onde seu dinheiro está indo",
    color: "purple",
  },
  {
    icon: TrendingUp,
    title: "Controle de Metas",
    description: "Defina objetivos e acompanhe seu progresso em tempo real",
    color: "blue",
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    description: "Notificações quando seus gastos ultrapassarem o planejado",
    color: "green",
  },
  {
    icon: Smartphone,
    title: "Multi-Plataforma",
    description: "Acesse de qualquer dispositivo com sincronização automática",
    color: "purple",
  },
  {
    icon: Lock,
    title: "Segurança Total",
    description: "Seus dados protegidos com criptografia de nível bancário",
    color: "blue",
  },
  {
    icon: Users,
    title: "Controle Compartilhado",
    description: "Gerencie finanças em família ou com parceiros",
    color: "green",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tudo que você precisa para controlar suas finanças
          </h2>
          <p className="text-xl text-slate-400">
            Recursos poderosos em uma interface simples
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition group"
              >
                <div className="w-14 h-14 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 text-purple-400 group-hover:bg-purple-500/20 transition">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
