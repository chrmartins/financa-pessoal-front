const faqs = [
  {
    q: "Como funciona o primeiro mês grátis?",
    a: "Você pode usar todos os recursos premium por 30 dias completamente grátis, sem precisar cadastrar cartão de crédito. Após esse período, se quiser continuar, basta assinar por apenas R$ 9,90/mês.",
  },
  {
    q: "Preciso cadastrar cartão de crédito?",
    a: "Não! Você pode começar a usar imediatamente sem precisar cadastrar nenhum meio de pagamento. Só pedimos o pagamento se você decidir continuar após o período gratuito.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim! Você pode cancelar sua assinatura a qualquer momento, sem multas ou taxas. Seu acesso continuará até o fim do período pago.",
  },
  {
    q: "Meus dados estão seguros?",
    a: "Absolutamente. Utilizamos criptografia de nível bancário (SSL/TLS 256-bit) e seguimos todas as normas da LGPD. Seus dados nunca são compartilhados com terceiros e você pode exportar ou deletar tudo a qualquer momento.",
  },
  {
    q: "Funciona no celular?",
    a: "Sim! O NControle é 100% responsivo e funciona perfeitamente em qualquer dispositivo: computador, tablet ou smartphone. Todos os dados são sincronizados automaticamente entre seus dispositivos.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Aceitamos cartão de crédito, débito e PIX. O pagamento é mensal e você recebe o recibo por email. Pode cancelar a qualquer momento sem burocracia.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-slate-400">Tudo que você precisa saber</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 group hover:border-purple-500/50 transition cursor-pointer"
            >
              <summary className="font-semibold text-white flex items-center justify-between select-none">
                <span className="text-lg">{faq.q}</span>
                <svg
                  className="w-5 h-5 text-slate-400 group-open:rotate-180 transition flex-shrink-0 ml-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <p className="text-slate-400 mt-4 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
