import {
  CTASection,
  DemoSection,
  FAQSection,
  FeaturesSection,
  Footer,
  Header,
  HeroSection,
  PricingSection,
  SocialProof,
  TestimonialsSection,
} from "./components";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <HeroSection />
      <SocialProof />
      <DemoSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
