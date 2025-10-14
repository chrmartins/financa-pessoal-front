import { Logo } from "@/components/Logo";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Logo />
            </Link>
            <p className="text-slate-400 text-sm">
              Controle financeiro simples e eficiente para todos.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition">
                  Preços
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-white transition">
                  Demonstração
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#faq" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@ncontrole.com.br"
                  className="hover:text-white transition"
                >
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacidade (LGPD)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Redes Sociais</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} NoControle. Todos os direitos
            reservados. CNPJ: XX.XXX.XXX/0001-XX
          </p>
          <p className="mt-2">Feito com ❤️ no Brasil 🇧🇷</p>
        </div>
      </div>
    </footer>
  );
}
