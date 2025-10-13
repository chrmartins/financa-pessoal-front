import { CheckCircle2 } from "lucide-react";

export function SocialProof() {
  return (
    <section className="py-12 border-y border-slate-800 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <p className="text-center text-slate-400 mb-8 text-sm uppercase tracking-wider">
          Confiado por milhares de brasileiros
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12">
          <div className="flex items-center space-x-2 text-slate-500">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="font-semibold">100% Seguro</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-500">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="font-semibold">Dados Criptografados</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-500">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="font-semibold">LGPD Compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
}
