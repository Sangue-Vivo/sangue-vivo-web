import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Info } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function RegistrationClosed() {
  return (
    <div className="min-h-screen bg-warm flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6" aria-label="Voltar para a página inicial">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Droplets className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-dark">Cadastro temporariamente suspenso</h1>
        </div>

        <Card>
          <div className="flex flex-col gap-4 text-gray-600">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p>
                O Sangue Vivo é um protótipo acadêmico em fase de testes. Enquanto ajustamos o
                tratamento de dados pessoais à LGPD, novos cadastros estão suspensos.
              </p>
            </div>
            <p>Quem já tem conta pode entrar normalmente.</p>
            <Link to="/login">
              <Button fullWidth>Entrar</Button>
            </Link>
            <Link to="/" className="text-center text-sm text-primary font-semibold hover:underline">
              Voltar para a página inicial
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
