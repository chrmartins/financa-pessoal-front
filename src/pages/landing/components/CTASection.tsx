import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="container mx-auto max-w-4xl text-center relative">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Pronto para ter controle total das suas finanças?
        </h2>
        <p className="text-xl md:text-2xl text-white/90 mb-8">
          Junte-se a milhares de brasileiros que já economizam com o NControle
        </p>
        <Link
          to="/login"
          className="inline-flex items-center bg-white hover:bg-slate-100 text-purple-700 px-10 py-5 rounded-xl transition font-bold text-xl group shadow-2xl"
        >
          Começar Agora Grátis por 30 Dias
          <ArrowRight className="ml-3 group-hover:translate-x-1 transition" />
        </Link>
        <p className="text-white/90 mt-6 text-lg">
          💳 Não precisa cartão de crédito • ⚡ Cancele quando quiser • 🔒 100%
          Seguro
        </p>
      </div>
    </section>
  );
}
