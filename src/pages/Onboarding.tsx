import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Heart, ArrowRight, Sparkles, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import BloodTypeBadge from '../components/ui/BloodTypeBadge';
import { useAuth } from '../hooks/useAuth';
import { BloodType } from '../types';
import { getCompatibleRecipients } from '../utils/bloodTypes';
import { BLOOD_TYPE_LABELS } from '../utils/bloodTypes';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const bloodType = user?.bloodType ?? BloodType.O_POSITIVE;
  const compatible = getCompatibleRecipients(bloodType);

  const handleNext = () => {
    if (step === 2) {
      navigate('/dashboard');
      return;
    }
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const steps = [
    // Step 1: Welcome
    <motion.div
      key="step-0"
      className="flex flex-col items-center text-center gap-6"
      variants={slideVariants}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center">
        <Droplets className="w-12 h-12 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-dark">
          Bem-vindo ao Sangue Vivo!
        </h1>
        <p className="mt-4 text-gray-500 text-lg max-w-md">
          Você acaba de dar o primeiro passo para salvar vidas. Vamos te mostrar como
          tudo funciona por aqui.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm mt-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <Heart className="w-6 h-6 text-coral mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-medium">Salve vidas</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <Users className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-medium">Comunidade</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <Sparkles className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-medium">Impacto</p>
        </div>
      </div>
    </motion.div>,

    // Step 2: Blood type compatibility
    <motion.div
      key="step-1"
      className="flex flex-col items-center text-center gap-6"
      variants={slideVariants}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
        <Heart className="w-12 h-12 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-dark">
          Seu tipo sanguíneo é {BLOOD_TYPE_LABELS[bloodType]}
        </h1>
        <p className="mt-4 text-gray-500 text-lg max-w-md">
          Com o tipo {BLOOD_TYPE_LABELS[bloodType]}, você pode ajudar pessoas com os seguintes tipos sanguíneos:
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {compatible.map((bt) => (
          <motion.div
            key={bt}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: compatible.indexOf(bt) * 0.1 }}
          >
            <BloodTypeBadge
              bloodType={bt}
              className="text-base px-4 py-2"
            />
          </motion.div>
        ))}
      </div>
      <p className="text-sm text-gray-400 mt-2">
        Isso significa que você pode ajudar{' '}
        <span className="font-bold text-primary">{compatible.length} tipos sanguíneos</span> diferentes!
      </p>
    </motion.div>,

    // Step 3: Impact
    <motion.div
      key="step-2"
      className="flex flex-col items-center text-center gap-6"
      variants={slideVariants}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-amber-500" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-dark">Vamos começar?</h1>
        <p className="mt-4 text-gray-500 text-lg max-w-md">
          Cada doação pode potencialmente ajudar até <span className="font-bold">4 pessoas</span>.
          Acompanhe alertas de estoque dos hemocentros e agende suas doações facilmente.
        </p>
      </div>
      <div className="w-full max-w-sm grid grid-cols-3 gap-4 mt-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-2xl font-bold text-primary">1</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Veja os alertas</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-2xl font-bold text-primary">2</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Agende a doação</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-2xl font-bold text-primary">3</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Salve vidas</p>
        </div>
      </div>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen bg-warm flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="min-h-[450px] flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            {steps[step]}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-col items-center gap-6">
          <Button
            size="lg"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            {step === 2 ? 'Começar' : 'Próximo'}
          </Button>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`rounded-full transition-all ${
                  i === step
                    ? 'w-8 h-2 bg-primary'
                    : i < step
                    ? 'w-2 h-2 bg-primary/40'
                    : 'w-2 h-2 bg-gray-300'
                }`}
                layout
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
