import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

const subjectOptions = [
  { value: '', label: 'Selecione o assunto' },
  { value: 'bug', label: 'Reportar um bug' },
  { value: 'sugestao', label: 'Sugestao' },
  { value: 'duvida', label: 'Duvida' },
  { value: 'outro', label: 'Outro' },
];

export default function SupportWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState(user?.email ?? '');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description.trim()) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);

    toast.success('Mensagem enviada! Responderemos em breve.');
    setSubject('');
    setDescription('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating blood drop button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Precisa de ajuda?"
          >
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 2C16 2 6 14 6 20C6 25.5228 10.4772 30 16 30C21.5228 30 26 25.5228 26 20C26 14 16 2 16 2Z"
                fill="white"
              />
            </svg>
            {/* Dripping drop animation */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
              animate={{
                y: [0, 4, 28],
                scaleY: [0.6, 1, 0.8],
                scaleX: [0.6, 1, 0.6],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                repeatDelay: 3,
                ease: [0.45, 0, 0.55, 1],
                times: [0, 0.25, 1],
              }}
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                <path
                  d="M4 0C4 0 0 5.5 0 7.5C0 9.98 1.79 12 4 12C6.21 12 8 9.98 8 7.5C8 5.5 4 0 4 0Z"
                  fill="white"
                  fillOpacity="0.7"
                />
              </svg>
            </motion.div>
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 bg-coral rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <span className="text-[10px] font-bold text-white">?</span>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Support panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-coral px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M16 2C16 2 6 14 6 20C6 25.5228 10.4772 30 16 30C21.5228 30 26 25.5228 26 20C26 14 16 2 16 2Z"
                    fill="white"
                  />
                </svg>
                <h3 className="text-white font-bold text-base">Suporte</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              <p className="text-sm text-gray-500">
                Encontrou um problema ou tem uma sugestao? Conta pra gente!
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Assunto</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-dark transition-all focus:outline-none focus:ring-4 focus:border-primary focus:ring-primary/20"
                >
                  {subjectOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Descricao</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o problema ou sugestao..."
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-dark resize-none transition-all focus:outline-none focus:ring-4 focus:border-primary focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Seu e-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-dark transition-all focus:outline-none focus:ring-4 focus:border-primary focus:ring-primary/20"
                />
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
                disabled={!subject || !description.trim()}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Enviar
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
