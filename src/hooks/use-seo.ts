import { useEffect } from "react";

interface UseSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function useSEO({
  title = "NControle - Sistema de Controle Financeiro Pessoal",
  description = "Sistema completo e gratuito para controle de finanças pessoais. Gerencie suas despesas, receitas e tenha controle total do seu dinheiro.",
  keywords = "controle financeiro pessoal, gestão de finanças, controle de despesas",
  image = "https://www.ncontrole.com.br/og-image.png",
  url = "https://www.ncontrole.com.br",
}: UseSEOProps = {}) {
  useEffect(() => {
    // Atualizar título
    document.title = title;

    // Atualizar meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(
        `meta[${attribute}="${name}"]`
      ) as HTMLMetaElement;

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.content = content;
    };

    // Meta tags básicas
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Open Graph
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", image, true);
    updateMetaTag("og:url", url, true);

    // Twitter
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);
    updateMetaTag("twitter:url", url);

    // Atualizar canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, keywords, image, url]);
}
