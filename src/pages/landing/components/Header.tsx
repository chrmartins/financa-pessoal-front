import { Logo } from "@/components/Logo";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="fixed top-0 w-full bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <a
            href="#features"
            className="text-slate-300 hover:text-white transition"
          >
            Recursos
          </a>
          <a
            href="#pricing"
            className="text-slate-300 hover:text-white transition"
          >
            Preços
          </a>
          <a href="#faq" className="text-slate-300 hover:text-white transition">
            FAQ
          </a>
          <Link
            to="/login"
            className="text-slate-300 hover:text-white transition"
          >
            Entrar
          </Link>
          <Link
            to="/login"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition font-medium"
          >
            Começar Grátis
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>
    </header>
  );
}
