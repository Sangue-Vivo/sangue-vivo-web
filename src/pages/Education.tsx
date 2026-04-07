import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ChevronDown,
  Lightbulb,
  X,
  CheckCircle2,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import Card from '../components/ui/Card';
import PageContainer from '../components/layout/PageContainer';

const requirements = [
  { text: 'Ter entre 16 e 69 anos', detail: 'Menores de 18 precisam de autorização dos pais.' },
  { text: 'Pesar mais de 50kg', detail: 'Peso mínimo necessário para garantir a segurança do doador.' },
  { text: 'Estar em bom estado de saúde', detail: 'Não estar com gripe, resfriado ou qualquer infecção.' },
  { text: 'Ter dormido pelo menos 6 horas nas últimas 24h', detail: 'O descanso adequado é essencial para a doação.' },
  { text: 'Não estar em jejum', detail: 'Faça uma refeição leve antes da doação. Evite alimentos gordurosos.' },
  { text: 'Não ter ingerido bebida alcoólica nas últimas 12h', detail: 'O álcool pode afetar a qualidade do sangue.' },
  { text: 'Apresentar documento de identidade com foto', detail: 'RG, CNH, passaporte ou carteira de trabalho.' },
  { text: 'Não ter feito tatuagem nos últimos 12 meses', detail: 'Período de segurança para evitar infecções.' },
];

const faqItems = [
  {
    question: 'A doação de sangue dói?',
    answer:
      'A dor é mínima, semelhante a uma picada de agulha. O procedimento é rápido e dura cerca de 10 a 15 minutos. A maioria dos doadores relata apenas um leve desconforto no momento da inserção da agulha.',
  },
  {
    question: 'Quanto tempo demora para doar sangue?',
    answer:
      'O processo completo, incluindo cadastro, triagem clínica, coleta e lanche, leva em média 40 minutos a 1 hora. A coleta em si dura apenas 10 a 15 minutos.',
  },
  {
    question: 'Com que frequência posso doar?',
    answer:
      'Homens podem doar a cada 60 dias (máximo 4 vezes por ano). Mulheres podem doar a cada 90 dias (máximo 3 vezes por ano). Esses intervalos garantem a recuperação completa do organismo.',
  },
  {
    question: 'Doar sangue engorda ou emagrece?',
    answer:
      'Não. A doação de sangue não causa alteração no peso corporal. O organismo repõe o volume de sangue doado em até 72 horas e os componentes celulares em algumas semanas.',
  },
  {
    question: 'Posso doar sangue tomando medicamento?',
    answer:
      'Depende do medicamento. Analgésicos comuns geralmente não impedem a doação. Antibióticos e alguns outros medicamentos podem exigir um período de espera. Informe ao médico durante a triagem.',
  },
  {
    question: 'O que acontece com o sangue doado?',
    answer:
      'O sangue passa por testes laboratoriais rigorosos e é separado em hemocomponentes (hemácias, plaquetas e plasma). Cada bolsa de sangue pode salvar até 4 vidas, sendo direcionada para pacientes em cirurgias, tratamentos oncológicos e emergências.',
  },
];

const myths = [
  {
    myth: 'Doar sangue deixa fraco',
    reality: 'O organismo repõe rapidamente o sangue doado. Em 24 a 72 horas o volume é recuperado.',
    isMythTrue: false,
  },
  {
    myth: 'Quem tem tatuagem nunca pode doar',
    reality: 'Quem tem tatuagem pode doar após 12 meses do procedimento, desde que feito em local regulamentado.',
    isMythTrue: false,
  },
  {
    myth: 'Fumantes não podem doar sangue',
    reality: 'Fumantes podem doar, mas devem aguardar 2 horas após o último cigarro antes da coleta.',
    isMythTrue: false,
  },
  {
    myth: 'Uma única doação pode salvar várias vidas',
    reality: 'Verdade! Uma bolsa de sangue é separada em componentes e pode ajudar até 4 pacientes diferentes.',
    isMythTrue: true,
  },
];

const facts = [
  'O sangue não pode ser fabricado. Cada doação é insubstituível.',
  'O Brasil precisa de 5.500 bolsas de sangue por dia.',
  'Apenas 1,6% da população brasileira doa sangue regularmente.',
  'O tipo O- é o doador universal e pode ser usado em emergências.',
  'O sangue doado tem validade: hemácias duram 42 dias, plaquetas apenas 5 dias.',
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-dark text-sm pr-4">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Education() {
  return (
    <PageContainer
      title="Educação sobre Doação"
      breadcrumbs={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Educação' },
      ]}
    >
      <div className="max-w-3xl mx-auto flex flex-col gap-10">
        {/* Requirements */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-dark">Quem pode doar?</h2>
          </div>
          <div className="flex flex-col gap-3">
            {requirements.map((req, index) => (
              <motion.div
                key={req.text}
                className="flex items-start gap-3 bg-green-50 rounded-xl p-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{req.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{req.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-dark">Perguntas frequentes</h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqItems.map((item) => (
              <FAQItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>

        {/* Myths vs Reality */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-dark">Mitos vs Realidade</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myths.map((item, index) => (
              <motion.div
                key={item.myth}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex items-start gap-3 mb-3">
                    {item.isMythTrue ? (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                        <X className="w-5 h-5 text-red-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-dark">
                        {item.isMythTrue ? 'Verdade' : 'Mito'}:{' '}
                        <span className="font-normal text-gray-700">"{item.myth}"</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.reality}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Did you know */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-dark">Você sabia?</h2>
          </div>
          <div className="flex flex-col gap-3">
            {facts.map((fact, index) => (
              <motion.div
                key={fact}
                className="flex items-center gap-3 bg-amber-50 rounded-xl p-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-sm text-gray-700">{fact}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
