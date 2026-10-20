import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight, ChevronLeft, RotateCcw, Info, CalendarCheck } from 'lucide-react';
import Button from './Button';
import {
  evaluateEligibility,
  ageOn,
  type EligibilityAnswers,
  type EligibilityResult,
} from '../../utils/eligibility';
import { formatDate } from '../../utils/formatters';

type AnswerKey = keyof EligibilityAnswers;

interface Step {
  id: AnswerKey;
  kind: 'yesno' | 'date' | 'choice';
  text: string;
  detail?: string;
  options?: { value: string; label: string }[];
  showIf?: (a: EligibilityAnswers) => boolean;
}

const YES_NO = [
  { value: 'yes', label: 'Sim' },
  { value: 'no', label: 'Não' },
];

const steps: Step[] = [
  { id: 'birthDate', kind: 'date', text: 'Qual é a sua data de nascimento?', detail: 'A doação é permitida de 16 a 69 anos.' },
  {
    id: 'donatedBefore60',
    kind: 'yesno',
    text: 'Você já doou sangue alguma vez antes dos 61 anos?',
    detail: 'A primeira doação precisa acontecer até 60 anos, 11 meses e 29 dias.',
    showIf: (a) => {
      const age = ageOn(a.birthDate, new Date());
      return age !== undefined && age >= 61 && age < 70;
    },
  },
  { id: 'weightOk', kind: 'yesno', text: 'Você pesa 50 kg ou mais?' },
  { id: 'feelingWell', kind: 'yesno', text: 'Está se sentindo bem de saúde hoje?' },
  { id: 'slept6h', kind: 'yesno', text: 'Dormiu pelo menos 6 horas nas últimas 24 horas?' },
  { id: 'alcohol12h', kind: 'yesno', text: 'Ingeriu bebida alcoólica nas últimas 12 horas?' },
  { id: 'fattyMeal3h', kind: 'yesno', text: 'Comeu alimentos gordurosos nas últimas 3 horas?' },
  { id: 'fasting', kind: 'yesno', text: 'Está há mais de 4 horas sem comer?' },
  {
    id: 'tattoo',
    kind: 'yesno',
    text: 'Fez tatuagem, maquiagem definitiva ou colocou piercing nos últimos 4 meses?',
  },
  { id: 'tattooDate', kind: 'date', text: 'Em que data foi o procedimento?', showIf: (a) => a.tattoo === 'yes' },
  {
    id: 'tattooLicensed',
    kind: 'choice',
    text: 'O procedimento foi feito em estabelecimento com licença da vigilância sanitária?',
    detail: 'Quando não é possível avaliar a segurança do procedimento, o prazo é maior.',
    options: [
      { value: 'yes', label: 'Sim' },
      { value: 'no', label: 'Não' },
      { value: 'unknown', label: 'Não sei' },
    ],
    showIf: (a) => a.tattoo === 'yes',
  },
  {
    id: 'piercingOralGenital',
    kind: 'choice',
    text: 'Você usa piercing na boca ou na região genital?',
    options: [
      { value: 'none', label: 'Não uso' },
      { value: 'wearing', label: 'Uso atualmente' },
      { value: 'removed', label: 'Retirei nos últimos 4 meses' },
    ],
  },
  {
    id: 'piercingRemovalDate',
    kind: 'date',
    text: 'Em que data você retirou o piercing?',
    showIf: (a) => a.piercingOralGenital === 'removed',
  },
  {
    id: 'antibiotic',
    kind: 'choice',
    text: 'Tomou antibiótico nas últimas 2 semanas?',
    options: [
      { value: 'none', label: 'Não' },
      { value: 'taking', label: 'Ainda estou tomando' },
      { value: 'finished', label: 'Já terminei' },
    ],
  },
  {
    id: 'antibioticEndDate',
    kind: 'date',
    text: 'Em que dia terminou o tratamento e os sintomas?',
    showIf: (a) => a.antibiotic === 'finished',
  },
  { id: 'otherMedication', kind: 'yesno', text: 'Usa algum outro medicamento de forma contínua ou controlada?' },
  { id: 'pregnant', kind: 'yesno', text: 'Está grávida?', detail: 'Se a pergunta não se aplica a você, responda "Não".' },
  {
    id: 'recentBirth',
    kind: 'yesno',
    text: 'Teve parto ou aborto nos últimos 12 meses?',
    detail: 'Se a pergunta não se aplica a você, responda "Não".',
    showIf: (a) => a.pregnant === 'no',
  },
  {
    id: 'birthEventDate',
    kind: 'date',
    text: 'Em que data foi o parto ou o aborto?',
    showIf: (a) => a.pregnant === 'no' && a.recentBirth === 'yes',
  },
  {
    id: 'breastfeeding',
    kind: 'yesno',
    text: 'Está amamentando?',
    showIf: (a) => a.pregnant === 'no' && a.recentBirth === 'yes',
  },
  {
    id: 'flu',
    kind: 'choice',
    text: 'Teve gripe ou resfriado nas últimas 2 semanas?',
    options: [
      { value: 'none', label: 'Não' },
      { value: 'ongoing', label: 'Ainda tenho sintomas' },
      { value: 'recovered', label: 'Sim, já me recuperei' },
    ],
  },
  { id: 'fluFever', kind: 'yesno', text: 'Teve febre de 38 °C ou mais?', showIf: (a) => a.flu === 'recovered' },
  { id: 'fluEndDate', kind: 'date', text: 'Em que dia os sintomas terminaram?', showIf: (a) => a.flu === 'recovered' },
  { id: 'donatedBefore', kind: 'yesno', text: 'Você já doou sangue antes?' },
  {
    id: 'lastDonationDate',
    kind: 'date',
    text: 'Qual foi a data da sua última doação?',
    showIf: (a) => a.donatedBefore === 'yes',
  },
  {
    id: 'intervalDays',
    kind: 'choice',
    text: 'Qual intervalo entre doações se aplica a você?',
    detail: 'A norma exige 60 dias para homens e 90 dias para mulheres.',
    options: [
      { value: '60', label: '60 dias' },
      { value: '90', label: '90 dias' },
      { value: 'unknown', label: 'Não sei' },
    ],
    showIf: (a) => a.donatedBefore === 'yes',
  },
];

function visibleSteps(answers: EligibilityAnswers): Step[] {
  return steps.filter((s) => !s.showIf || s.showIf(answers));
}

function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

interface EligibilityChecklistProps {
  /** 'register' = durante o cadastro, 'pre-donation' = antes de procurar o hemocentro */
  mode: 'register' | 'pre-donation';
  onComplete?: (result: EligibilityResult) => void;
  onSkip?: () => void;
}

const RESULT_STYLE = {
  eligible: { box: 'bg-green-50 border-green-200', title: 'text-green-800', icon: CheckCircle2, iconColor: 'text-green-600' },
  review: { box: 'bg-amber-50 border-amber-200', title: 'text-amber-800', icon: AlertTriangle, iconColor: 'text-amber-600' },
  wait: { box: 'bg-amber-50 border-amber-200', title: 'text-amber-800', icon: CalendarCheck, iconColor: 'text-amber-600' },
  not_eligible: { box: 'bg-red-50 border-red-200', title: 'text-red-800', icon: XCircle, iconColor: 'text-red-600' },
} as const;

const RESULT_TITLE = {
  eligible: 'Pelas suas respostas, você pode doar',
  review: 'Você provavelmente pode doar, mas o hemocentro precisa avaliar',
  wait: 'Você ainda não pode doar',
  not_eligible: 'No momento, você não pode doar',
} as const;

function resultSummary(r: EligibilityResult): string {
  if (r.status === 'wait') {
    if (r.returnDate && !r.hasUndatedWait) return `Você poderá doar a partir de ${formatDate(r.returnDate)}.`;
    if (r.returnDate) return `Pelos prazos informados, a partir de ${formatDate(r.returnDate)}, se as demais condições abaixo estiverem resolvidas.`;
    return 'Refaça a pré-triagem quando a situação abaixo mudar.';
  }
  if (r.status === 'eligible') return 'Você atende aos requisitos básicos verificados aqui.';
  if (r.status === 'review') return 'Não há impedimento nas suas respostas, mas um ponto depende de avaliação na triagem.';
  return 'Veja o motivo abaixo. Em caso de dúvida, fale com o hemocentro.';
}

export default function EligibilityChecklist({ mode, onComplete, onSkip }: EligibilityChecklistProps) {
  const [answers, setAnswers] = useState<EligibilityAnswers>({});
  const [history, setHistory] = useState<AnswerKey[]>([]);
  const [currentId, setCurrentId] = useState<AnswerKey>(steps[0].id);
  const [dateValue, setDateValue] = useState('');
  const [finished, setFinished] = useState(false);

  const visible = useMemo(() => visibleSteps(answers), [answers]);
  const current = steps.find((s) => s.id === currentId) ?? steps[0];
  const position = Math.max(visible.findIndex((s) => s.id === currentId), 0);
  const result = useMemo(() => (finished ? evaluateEligibility(answers) : null), [finished, answers]);

  const answer = (value: string) => {
    const next = { ...answers, [current.id]: value } as EligibilityAnswers;
    setAnswers(next);
    setHistory((h) => [...h, current.id]);
    setDateValue('');
    const order = visibleSteps(next);
    const idx = order.findIndex((s) => s.id === current.id);
    const following = order[idx + 1];
    if (following) {
      setCurrentId(following.id);
    } else {
      setFinished(true);
    }
  };

  const goBack = () => {
    const prev = history[history.length - 1];
    if (!prev) return;
    setHistory((h) => h.slice(0, -1));
    setFinished(false);
    setCurrentId(prev);
    const prevStep = steps.find((s) => s.id === prev);
    setDateValue(prevStep?.kind === 'date' ? String(answers[prev] ?? '') : '');
  };

  const restart = () => {
    setAnswers({});
    setHistory([]);
    setCurrentId(steps[0].id);
    setDateValue('');
    setFinished(false);
  };

  if (finished && result) {
    const style = RESULT_STYLE[result.status];
    const Icon = style.icon;
    return (
      <motion.div
        className="w-full max-w-lg mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={`rounded-2xl border p-6 sm:p-8 text-center ${style.box}`} role="status" aria-live="polite">
          <Icon className={`w-16 h-16 mx-auto mb-4 ${style.iconColor}`} aria-hidden="true" />
          <h2 className={`text-xl font-bold mb-2 ${style.title}`}>{RESULT_TITLE[result.status]}</h2>
          <p className="text-sm text-gray-700 mb-6">{resultSummary(result)}</p>

          {result.findings.length > 0 && (
            <div className="text-left mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Pontos de atenção:</p>
              <ul className="flex flex-col gap-2">
                {result.findings.map((f) => (
                  <li key={f.rule + f.kind} className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg px-3 py-2">
                    <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>
                      {f.message}
                      {f.until && <strong className="block mt-1">Liberado a partir de {formatDate(f.until)}.</strong>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-gray-600 mb-6">
            Este resultado é só uma orientação: a aptidão é decidida na triagem do hemocentro. Suas respostas
            ficam neste navegador e não são enviadas nem guardadas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />} onClick={goBack}>
              Voltar
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={restart}>
              Refazer pré-triagem
            </Button>
            {mode === 'register' && (
              <Button size="sm" onClick={() => onComplete?.(result)}>
                Continuar cadastro
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  const choiceOptions = current.kind === 'yesno' ? YES_NO : current.options ?? [];
  const inputId = `pretriagem-${current.id}`;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <span>Pré-triagem</span>
          <span>
            Pergunta {position + 1} de {visible.length}
          </span>
        </div>
        <div
          className="h-2 bg-gray-100 rounded-full overflow-hidden"
          role="progressbar"
          aria-label="Progresso da pré-triagem"
          aria-valuemin={0}
          aria-valuemax={visible.length}
          aria-valuenow={position}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-coral rounded-full"
            animate={{ width: `${(position / visible.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {current.kind === 'date' ? (
            <label htmlFor={inputId} className="block text-lg font-bold text-dark mb-2">
              {current.text}
            </label>
          ) : (
            <p className="text-lg font-bold text-dark mb-2" id={inputId}>
              {current.text}
            </p>
          )}
          {current.detail && (
            <p className="text-sm text-gray-600 mb-4 flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 shrink-0 text-gray-500" aria-hidden="true" />
              {current.detail}
            </p>
          )}

          {current.kind === 'date' ? (
            <form
              className="flex flex-col gap-3 mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (dateValue) answer(dateValue);
              }}
            >
              <input
                id={inputId}
                type="date"
                required
                max={todayIso()}
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base text-dark focus:border-primary focus:outline-none"
              />
              <Button type="submit" disabled={!dateValue} rightIcon={<ChevronRight className="w-4 h-4" />}>
                Continuar
              </Button>
            </form>
          ) : (
            <div
              className={`grid gap-3 mt-6 ${choiceOptions.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}
              role="group"
              aria-labelledby={inputId}
            >
              {choiceOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => answer(opt.value)}
                  className="py-4 px-3 rounded-xl text-base font-bold border-2 border-gray-200 text-gray-700 hover:border-primary hover:bg-primary-light hover:text-primary transition-all cursor-pointer"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-between">
        {history.length > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="text-sm text-gray-600 hover:text-dark inline-flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Voltar
          </button>
        ) : (
          <span />
        )}
        {mode === 'register' && (
          <button type="button" onClick={onSkip} className="text-sm text-gray-600 hover:text-dark cursor-pointer">
            Pular por agora — responderei depois
          </button>
        )}
      </div>
    </div>
  );
}
