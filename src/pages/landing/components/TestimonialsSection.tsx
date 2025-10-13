const testimonials = [
  {
    name: "Maria Silva",
    role: "Professora",
    text: "Consegui economizar R$ 800 no primeiro mês! Nunca imaginei que era tão fácil controlar meus gastos. O NControle mudou minha vida financeira.",
    rating: 5,
  },
  {
    name: "João Santos",
    role: "Desenvolvedor",
    text: "Interface linda e super intuitiva. Em 5 minutos eu já estava usando. Melhor investimento de R$ 9,90 que já fiz!",
    rating: 5,
  },
  {
    name: "Ana Costa",
    role: "Empreendedora",
    text: "Uso para controlar as finanças pessoais e da empresa. Os relatórios são incríveis e me ajudam muito na tomada de decisões.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-slate-900/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            O que nossos usuários dizem
          </h2>
          <p className="text-xl text-slate-400">
            Milhares de pessoas já transformaram suas finanças
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-600"></div>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
