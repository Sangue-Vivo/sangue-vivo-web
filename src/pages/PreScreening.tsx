import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import EligibilityChecklist from '../components/ui/EligibilityChecklist';

// Pré-triagem pública: roda inteira no navegador, sem login e sem enviar respostas.
export default function PreScreening() {
  return (
    <div className="min-h-screen bg-warm flex items-center justify-center p-4 py-8">
      <motion.main
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6" aria-label="Voltar para a página inicial">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Droplets className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-dark">Posso doar sangue?</h1>
          <p className="text-gray-600 mt-1">Responda à pré-triagem e veja a partir de quando você pode doar</p>
        </div>

        <EligibilityChecklist mode="pre-donation" />

        <p className="text-center text-sm text-gray-600 mt-6">
          Endereços e horários do Hemoal estão na{' '}
          <Link to="/#hemocentros" className="text-primary font-semibold hover:underline">
            página inicial
          </Link>
          .
        </p>
      </motion.main>
    </div>
  );
}
