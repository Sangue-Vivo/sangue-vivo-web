import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const STORAGE_KEY = 'sangue-vivo-cookies-accepted';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 p-4 flex justify-center"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="bg-white shadow-lg rounded-2xl p-5 max-w-2xl w-full flex flex-col sm:flex-row items-center gap-4">
            <p className="text-sm text-gray-600 flex-1">
              Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa{' '}
              <Link to="/privacy" className="text-primary font-semibold hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => setVisible(false)}>
                Configurar
              </Button>
              <Button size="sm" onClick={handleAccept}>
                Aceitar
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
