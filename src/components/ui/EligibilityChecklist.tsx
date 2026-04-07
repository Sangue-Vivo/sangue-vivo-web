import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight, RotateCcw, Info } from 'lucide-react';
import Button from './Button';

interface Question {
  id: string;
  text: string;
  /** true = "Sim" means ELIGIBLE, false = "Sim" means NOT eligible */
  yesIsGood: boolean;
  detail?: string;
  blockingMessage?: string;
}

const questions: Question[] = [
  {
    id: 'age',
    text: 'Você tem entre 16 e 69 anos?',
    yesIsGood: true,
    blockingMessage: 'A doação de sangue é permitida para pessoas entre 16 e 69 anos.',
  },
  {
    id: 'weight',
    text: 'Você pesa mais de 50kg?',
    yesIsGood: true,
    blockingMessage: 'O peso mínimo para doação de sangue é 50kg.',
  },
  {
    id: 'health',
    text: 'Está se sentindo bem de saúde hoje?',
    yesIsGood: true,
    blockingMessage: 'É importante estar em bom estado de saúde no dia da doação. Aguarde sua recuperação.',
  },
  {
    id: 'sleep',
    text: 'Dormiu pelo menos 6 horas nas últimas 24 horas?',
    yesIsGood: true,
    blockingMessage: 'É necessário ter dormido no mínimo 6 horas antes de doar.',
  },
  {
    id: 'tattoo',
    text: 'Fez tatuagem ou piercing nos últimos 12 meses?',
    yesIsGood: false,
    detail: 'Tatuagens e piercings recentes podem representar risco de infecção.',
    blockingMessage: 'Após fazer tatuagem ou piercing, é necessário aguardar 12 meses para poder doar.',
  },
  {
    id: 'alcohol',
    text: 'Ingeriu bebida alcoólica nas últimas 12 horas?',
    yesIsGood: false,
    blockingMessage: 'Aguarde pelo menos 12 horas após ingerir bebida alcoólica.',
  },
  {
    id: 'medication',
    text: 'Está tomando algum antibiótico ou medicamento controlado?',
    yesIsGood: false,
    detail: 'Alguns medicamentos impedem a doação temporariamente.',
    blockingMessage: 'O uso de certos medicamentos pode impedir a doação temporariamente. Consulte o hemocentro.',
  },
  {
    id: 'pregnant',
    text: 'Está grávida ou amamentando?',
    yesIsGood: false,
    blockingMessage: 'Gestantes e lactantes não podem doar sangue.',
  },
  {
    id: 'flu',
    text: 'Teve gripe, resfriado ou febre nos últimos 7 dias?',
    yesIsGood: false,
    blockingMessage: 'Aguarde pelo menos 7 dias após os sintomas desaparecerem.',
  },
  {
    id: 'fasting',
    text: 'Está em jejum prolongado (mais de 4 horas sem comer)?',
    yesIsGood: false,
    detail: 'Faça uma refeição leve antes de doar. Evite alimentos gordurosos.',
    blockingMessage: 'Não doe em jejum. Faça uma refeição leve antes.',
  },
];

type Result = 'eligible' | 'not_eligible' | 'partial';

interface EligibilityChecklistProps {
  /** 'register' = during signup, 'pre-donation' = before scheduling */
  mode: 'register' | 'pre-donation';
  onComplete?: (result: Result, answers: Record<string, boolean>) => void;
  onSkip?: () => void;
}

export default function EligibilityChecklist({ mode, onComplete, onSkip }: EligibilityChecklistProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [blockers, setBlockers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const handleAnswer = (yes: boolean) => {
    const q = questions[currentIndex];
    const isBlocking = yes ? !q.yesIsGood : q.yesIsGood;

    setAnswers((prev) => ({ ...prev, [q.id]: yes }));

    if (isBlocking && q.blockingMessage) {
      setBlockers((prev) => [...prev, q.blockingMessage!]);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
      const newBlockers = isBlocking && q.blockingMessage
        ? [...blockers, q.blockingMessage]
        : blockers;

      const result: Result = newBlockers.length === 0
        ? 'eligible'
        : newBlockers.length <= 2
          ? 'partial'
          : 'not_eligible';

      onComplete?.(result, { ...answers, [q.id]: yes });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setBlockers([]);
    setFinished(false);
  };

  if (finished) {
    const result: Result = blockers.length === 0
      ? 'eligible'
      : blockers.length <= 2
        ? 'partial'
        : 'not_eligible';

    return (
      <motion.div
        className="w-full max-w-lg mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={`rounded-2xl p-6 sm:p-8 text-center ${
          result === 'eligible'
            ? 'bg-green-50 border border-green-200'
            : result === 'partial'
              ? 'bg-amber-50 border border-amber-200'
              : 'bg-red-50 border border-red-200'
        }`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            {result === 'eligible' ? (
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            ) : result === 'partial' ? (
              <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            )}
          </motion.div>

          <h3 className={`text-xl font-bold mb-2 ${
            result === 'eligible' ? 'text-green-800' : result === 'partial' ? 'text-amber-800' : 'text-red-800'
          }`}>
            {result === 'eligible'
              ? 'Ótimo! Você pode doar!'
              : result === 'partial'
                ? 'Atenção — verifique com o hemocentro'
                : 'No momento, você não pode doar'}
          </h3>

          <p className={`text-sm mb-6 ${
            result === 'eligible' ? 'text-green-600' : result === 'partial' ? 'text-amber-600' : 'text-red-600'
          }`}>
            {result === 'eligible'
              ? 'Com base nas suas respostas, você atende aos requisitos básicos para doação de sangue.'
              : result === 'partial'
                ? 'Algumas respostas indicam possíveis impedimentos. Consulte o hemocentro para mais informações.'
                : 'Mas não desanime! Assim que a situação mudar, você poderá voltar a doar.'}
          </p>

          {blockers.length > 0 && (
            <div className="text-left mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Pontos de atenção:</p>
              <ul className="flex flex-col gap-2">
                {blockers.map((msg, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 bg-white rounded-lg px-3 py-2">
                    <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={handleRestart}
            >
              Refazer checklist
            </Button>
            {mode === 'register' && (
              <Button size="sm" onClick={() => onComplete?.(result, answers)}>
                Continuar cadastro
              </Button>
            )}
            {mode === 'pre-donation' && result === 'eligible' && (
              <Button size="sm" rightIcon={<ChevronRight className="w-4 h-4" />} onClick={() => onComplete?.(result, answers)}>
                Encontrar hemocentro
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Checklist de elegibilidade</span>
          <span>{currentIndex + 1} de {questions.length}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-coral rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-lg font-bold text-dark mb-2">{currentQuestion.text}</p>
          {currentQuestion.detail && (
            <p className="text-sm text-gray-500 mb-6 flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
              {currentQuestion.detail}
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 py-4 rounded-xl text-base font-bold border-2 border-gray-200 text-gray-700 hover:border-primary hover:bg-primary-light hover:text-primary transition-all cursor-pointer"
            >
              Sim
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 py-4 rounded-xl text-base font-bold border-2 border-gray-200 text-gray-700 hover:border-primary hover:bg-primary-light hover:text-primary transition-all cursor-pointer"
            >
              Não
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Skip option for register mode */}
      {mode === 'register' && (
        <button
          onClick={onSkip}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors mx-auto block cursor-pointer"
        >
          Pular por agora — responderei depois
        </button>
      )}
    </div>
  );
}
