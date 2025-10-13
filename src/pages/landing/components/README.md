# 📦 Componentes da Landing Page

Esta pasta contém todos os componentes da landing page, organizados de forma modular e reutilizável.

## 📁 Estrutura:

```
components/
├── index.ts                    # Exportações centralizadas
├── Header.tsx                  # 🔝 Navegação principal
├── HeroSection.tsx             # 🎯 Seção hero (primeira impressão)
├── SocialProof.tsx             # ✅ Prova social (badges de segurança)
├── DemoSection.tsx             # 📸 Screenshots/demonstração
├── FeaturesSection.tsx         # ⚡ Recursos principais (6 features)
├── PricingSection.tsx          # 💰 Seção de preços (R$ 9,90)
├── FAQSection.tsx              # ❓ Perguntas frequentes (8 FAQs)
├── TestimonialsSection.tsx     # ⭐ Depoimentos de usuários
├── CTASection.tsx              # 🎉 Call-to-action final
└── Footer.tsx                  # 📄 Rodapé com links
```

## 🎨 Componentes:

### 1. **Header.tsx** (41 linhas)

- Navegação fixa no topo
- Links para seções (#features, #pricing, #faq)
- Botão CTA "Começar Grátis"
- Menu mobile (responsive)

### 2. **HeroSection.tsx** (111 linhas)

- Badge "Primeiro mês GRÁTIS"
- Título principal com gradiente
- CTAs principais (Começar Grátis + Ver Demo)
- Screenshot do dashboard
- Cards flutuantes (Economia + Meta)
- Social proof (10k usuários, 4.9 estrelas)

### 3. **SocialProof.tsx** (28 linhas)

- 3 badges de confiança
- 100% Seguro, Criptografia, LGPD

### 4. **DemoSection.tsx** (58 linhas)

- 2 cards com screenshots
- Dashboard completo + Gráficos inteligentes
- Hover effects

### 5. **FeaturesSection.tsx** (69 linhas)

- Grid 3 colunas (responsive)
- 6 features principais:
  - Relatórios Visuais
  - Controle de Metas
  - Alertas Inteligentes
  - Multi-Plataforma
  - Segurança Total
  - Controle Compartilhado

### 6. **PricingSection.tsx** (122 linhas)

- Badge destacado "PRIMEIRO MÊS GRÁTIS"
- Preço: R$ 9,90/mês (era R$ 19,90)
- Lista de 10 recursos inclusos
- CTA "Começar Teste Grátis de 30 Dias"
- 3 garantias (sem cartão, cancele quando quiser, 7 dias)

### 7. **FAQSection.tsx** (77 linhas)

- 8 perguntas/respostas em accordion
- Expansível com animação
- Hover effects

### 8. **TestimonialsSection.tsx** (52 linhas)

- 3 depoimentos de usuários
- Rating de 5 estrelas
- Avatar, nome, profissão

### 9. **CTASection.tsx** (37 linhas)

- Background com gradiente colorido
- Título impactante
- CTA principal
- 3 garantias (emojis)

### 10. **Footer.tsx** (66 linhas)

- Logo + descrição
- 4 colunas de links:
  - Produto
  - Suporte
  - Redes Sociais
- Copyright + "Feito com ❤️ no Brasil"

## 🔧 Como usar:

Todos os componentes são exportados centralmente através de `index.ts`:

```tsx
import {
  Header,
  HeroSection,
  SocialProof,
  DemoSection,
  FeaturesSection,
  PricingSection,
  FAQSection,
  TestimonialsSection,
  CTASection,
  Footer
} from './components';

// Uso:
<Header />
<HeroSection />
// ...
```

## 📊 Estatísticas:

- **Antes:** 1 arquivo com 745 linhas
- **Depois:** 11 arquivos com média de ~60 linhas cada
- **Benefícios:**
  - ✅ Código mais legível e organizado
  - ✅ Fácil de manter e atualizar
  - ✅ Componentes reutilizáveis
  - ✅ Melhor performance de desenvolvimento
  - ✅ Testes mais fáceis

## 🎯 Próximos passos:

1. Adicionar screenshots reais em `/public/images/`
2. Testar responsividade em diferentes dispositivos
3. Adicionar animações com framer-motion (opcional)
4. A/B testing dos CTAs
5. Analytics (Google Analytics, Hotjar)

## 📝 Boas práticas:

- Cada componente tem uma única responsabilidade
- Props tipadas com TypeScript
- Imports organizados (icons, react-router, etc)
- Tailwind CSS para estilização
- Semantic HTML (section, header, footer)
- Acessibilidade (alt text, aria-labels quando necessário)
