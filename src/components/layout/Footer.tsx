import { Link } from 'react-router-dom';
import { Droplets } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold">
                Sangue <span className="text-primary">Vivo</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Conectando doadores universitarios a quem mais precisa. Cada gota conta.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-400">
              Links
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  to="/hemocentros"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Hemocentros
                </Link>
              </li>
              <li>
                <Link
                  to="/sobre"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  to="/contato"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  to="/educacao"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Educacao
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-400">
              Apoio
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  to="/faq"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/termos"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  to="/privacidade"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            Feito com ❤️ em Alagoas
          </p>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Sangue Vivo. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
