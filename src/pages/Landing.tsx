import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import {
  UserPlus,
  Search,
  Check,
  Phone,
  MapPin,
  Heart,
  Droplets,
  ChevronRight,
  Zap,
  Users,
  Trophy,
  Quote,
  Shield,
  Sparkles,
  GraduationCap,
  Mail,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { duration: 2000, bounce: 0 });
  const rounded = useTransform(spring, (v) => Math.round(v).toLocaleString('pt-BR') + suffix);

  if (isInView) {
    spring.set(target);
  }

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const steps = [
  {
    icon: UserPlus,
    title: '1. Cadastre-se',
    description: 'Crie sua conta em poucos minutos e informe seu tipo sanguíneo.',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Search,
    title: '2. Encontre uma causa',
    description: 'Descubra causas compatíveis com seu tipo sanguíneo perto de você.',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    icon: Heart,
    title: '3. Doe e salve vidas',
    description: 'Faça sua doação e ajude a manter os estoques dos hemocentros. Cada doação pode salvar até 4 vidas.',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
];

const requirements = [
  'Ter entre 16 e 69 anos',
  'Pesar mais de 50kg',
  'Estar em bom estado de saúde',
  'Ter dormido pelo menos 6 horas nas últimas 24h',
  'Não estar em jejum',
  'Não ter ingerido bebida alcoólica nas últimas 12h',
  'Apresentar documento de identidade com foto',
];

const bloodCenters = [
  {
    name: 'Hemoal Maceió',
    address: 'Av. Jorge de Lima, 58 - Trapiche da Barra, Maceió - AL',
    phone: '(82) 3315-2102',
    hours: 'Seg a Sex: 7h às 18h | Sáb: 7h às 13h',
  },
  {
    name: 'Hemoal Arapiraca',
    address: 'Rua Samaritana, s/n - Baixa Grande, Arapiraca - AL',
    phone: '(82) 3522-1974',
    hours: 'Seg a Sex: 7h às 13h',
  },
];

const stats = [
  { label: 'Doações realizadas', value: 1247, icon: Droplets, suffix: '' },
  { label: 'Vidas impactadas', value: 4988, icon: Heart, suffix: '' },
  { label: 'Doadores ativos', value: 386, icon: Users, suffix: '' },
  { label: 'Universidades', value: 12, icon: Trophy, suffix: '' },
];

const testimonials = [
  {
    name: 'Maria Clara',
    course: 'Medicina - UFAL',
    text: 'O app me avisa quando o hemocentro precisa do meu tipo sanguíneo. Muito prático para quem quer ajudar!',
    avatar: 'MC',
    donations: 8,
  },
  {
    name: 'Lucas Oliveira',
    course: 'Eng. de Computação - IFAL',
    text: 'Recebi um alerta de estoque crítico e fui doar no mesmo dia. É muito fácil encontrar onde doar perto de mim.',
    avatar: 'LO',
    donations: 5,
  },
  {
    name: 'Ana Beatriz',
    course: 'Direito - CESMAC',
    text: 'Os lembretes me ajudam a manter o hábito de doar. Já são 12 doações e pretendo continuar!',
    avatar: 'AB',
    donations: 12,
  },
];

export default function Landing() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen bg-warm">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Droplets className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold text-dark">Sangue Vivo</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#como-funciona" className="text-sm font-medium text-gray-500 hover:text-dark transition-colors">
              Como funciona
            </a>
            <a href="#como-doar" className="text-sm font-medium text-gray-500 hover:text-dark transition-colors">
              Como doar
            </a>
            <a href="#requisitos" className="text-sm font-medium text-gray-500 hover:text-dark transition-colors">
              Quem pode doar
            </a>
            <a href="#hemocentros" className="text-sm font-medium text-gray-500 hover:text-dark transition-colors">
              Hemocentros
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    Meu Perfil
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="primary" size="sm">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Criar conta
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero - Split layout with illustration */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-red-500 to-coral" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_40%)]" />

        {/* Single blood drop falling */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: '-60px' }}
            animate={{ y: [0, 800], opacity: [0.6, 0.3, 0] }}
            transition={{
              y: { duration: 4, repeat: Infinity, ease: [0.45, 0, 0.55, 1] },
              opacity: { duration: 4, repeat: Infinity, ease: 'easeOut' },
            }}
          >
            {/* SVG blood drop shape */}
            <svg width="40" height="56" viewBox="0 0 40 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 0C20 0 0 28 0 38C0 48.5 8.95 56 20 56C31.05 56 40 48.5 40 38C40 28 20 0 20 0Z"
                fill="white"
                fillOpacity="0.25"
              />
              <path
                d="M20 4C20 4 4 29 4 38C4 46.3 11.16 52 20 52C28.84 52 36 46.3 36 38C36 29 20 4 20 4Z"
                fill="white"
                fillOpacity="0.1"
              />
            </svg>
          </motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text content */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Heart className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-white">
                  Conectando doadores a quem precisa em Alagoas
                </span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-sm">
                Cada gota conta.{' '}
                <span className="relative">
                  <span className="text-white">Sua doação salva vidas.</span>
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-1.5 bg-white/40 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    style={{ originX: 0 }}
                  />
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Conectamos estudantes universitários de Alagoas aos hemocentros da região.
                Doe sangue, salve vidas e faça parte de uma comunidade que transforma.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                <Link to="/register">
                  <button
                    className="flex items-center gap-2 px-8 py-4 bg-white text-red-600 font-bold text-lg rounded-2xl shadow-xl shadow-black/20 hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    Criar minha conta
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link to="/login">
                  <button
                    className="flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border-2 border-white/40 hover:bg-white/30 hover:border-white/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    Já tenho conta
                  </button>
                </Link>
              </div>

              <motion.div
                className="mt-10 inline-flex items-center gap-3 bg-white/15 backdrop-blur-md rounded-full px-6 py-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.2 }}
                >
                  <Heart className="w-5 h-5 text-rose-200" />
                </motion.div>
                <p className="text-base font-bold text-white">
                  <AnimatedCounter target={1247} /> doações realizadas
                </p>
              </motion.div>
            </motion.div>

            {/* Right - Hero illustration */}
            <motion.div
              className="hidden lg:flex items-center justify-center"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative w-[420px] h-[420px]">
                {/* Pulsing ring background */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/10"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute inset-6 rounded-full border border-white/10"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />

                {/* Central blood drop illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <svg width="180" height="240" viewBox="0 0 180 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="dropGradient" x1="90" y1="0" x2="90" y2="240" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="white" stopOpacity="0.4" />
                          <stop offset="1" stopColor="white" stopOpacity="0.15" />
                        </linearGradient>
                        <radialGradient id="dropHighlight" cx="0.35" cy="0.35" r="0.65">
                          <stop offset="0" stopColor="white" stopOpacity="0.3" />
                          <stop offset="1" stopColor="white" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <path
                        d="M90 10C90 10 10 120 10 165C10 210 45 235 90 235C135 235 170 210 170 165C170 120 90 10 90 10Z"
                        fill="url(#dropGradient)"
                        stroke="white"
                        strokeOpacity="0.3"
                        strokeWidth="2"
                      />
                      <path
                        d="M90 10C90 10 10 120 10 165C10 210 45 235 90 235C135 235 170 210 170 165C170 120 90 10 90 10Z"
                        fill="url(#dropHighlight)"
                      />
                      {/* Shine reflection */}
                      <ellipse cx="60" cy="140" rx="18" ry="35" fill="white" fillOpacity="0.12" transform="rotate(-15 60 140)" />
                    </svg>
                  </motion.div>
                </div>

                {/* Floating info badges around the drop */}
                <motion.div
                  className="absolute top-8 right-4 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-200" />
                    <span className="text-sm font-bold text-white">até 4 vidas</span>
                  </div>
                  <span className="text-xs text-white/60">poderão ser salvas</span>
                </motion.div>

                <motion.div
                  className="absolute bottom-16 left-0 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-300" />
                    <span className="text-sm font-bold text-white">Salve vidas</span>
                  </div>
                  <span className="text-xs text-white/60">com sua doação</span>
                </motion.div>

                <motion.div
                  className="absolute top-1/2 -right-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-200" />
                    <span className="text-sm font-bold text-white">386+</span>
                  </div>
                  <span className="text-xs text-white/60">doadores</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Animated wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <div className="relative h-[120px]">
            <svg
              className="absolute bottom-0 w-[200%] h-full animate-wave-slow"
              viewBox="0 0 2880 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M0 80C240 100 480 40 720 60C960 80 1200 100 1440 70C1680 40 1920 80 2160 60C2400 40 2640 90 2880 80V120H0Z"
                fill="#FFF7ED"
                opacity="0.5"
              />
            </svg>
            <svg
              className="absolute bottom-0 w-[200%] h-full animate-wave"
              viewBox="0 0 2880 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M0 120L60 108C120 96 240 72 360 66C480 60 600 72 720 78C840 84 960 84 1080 78C1200 72 1320 60 1380 54L1440 48C1500 42 1560 54 1680 66C1800 78 1920 96 2040 102C2160 108 2280 96 2400 84C2520 72 2640 60 2760 54L2880 48V120H0Z"
                fill="#FFF7ED"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-4 z-10 pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-primary mr-2" />
                  <span className="text-2xl sm:text-3xl font-extrabold text-dark">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 sm:py-28 bg-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-primary-light text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              SIMPLES E RÁPIDO
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark">Como funciona?</h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
              Em três passos simples, você pode salvar até 4 vidas com uma única doação.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <div className={`w-16 h-16 ${step.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">{step.title}</h3>
                <p className="text-gray-500">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="hidden md:flex items-center justify-center mt-8">
            <motion.div
              className="flex items-center gap-2 text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-500">
                Todo o processo leva menos de 30 minutos!
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impacto visual - por que doar */}
      <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-light/50 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Illustration */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                {/* Main circle illustration */}
                <div className="w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] bg-gradient-to-br from-primary-light via-rose-50 to-orange-50 rounded-full flex items-center justify-center relative">
                  {/* Inner pattern circles */}
                  <div className="absolute inset-4 rounded-full border-2 border-dashed border-primary/10" />
                  <div className="absolute inset-12 rounded-full border border-primary/5" />

                  {/* Center icon */}
                  <motion.div
                    className="w-28 h-28 bg-white rounded-3xl shadow-xl flex items-center justify-center"
                    animate={{ rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <svg width="64" height="80" viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M32 4C32 4 4 40 4 56C4 68 16 76 32 76C48 76 60 68 60 56C60 40 32 4 32 4Z"
                        fill="#DC2626"
                        fillOpacity="0.9"
                      />
                      <path
                        d="M32 12C32 12 10 42 10 56C10 65 19 72 32 72C45 72 54 65 54 56C54 42 32 12 32 12Z"
                        fill="#EF4444"
                        fillOpacity="0.6"
                      />
                      <ellipse cx="22" cy="48" rx="6" ry="12" fill="white" fillOpacity="0.2" transform="rotate(-10 22 48)" />
                    </svg>
                  </motion.div>

                  {/* Orbiting badges */}
                  <motion.div
                    className="absolute -top-2 right-8 bg-white rounded-xl shadow-lg px-3 py-2 border border-gray-100"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <span className="text-2xl">🩸</span>
                    <p className="text-xs font-bold text-dark">450ml</p>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-4 -left-4 bg-white rounded-xl shadow-lg px-3 py-2 border border-gray-100"
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  >
                    <span className="text-2xl">❤️</span>
                    <p className="text-xs font-bold text-dark">4 vidas</p>
                  </motion.div>

                  <motion.div
                    className="absolute top-1/2 -right-6 bg-white rounded-xl shadow-lg px-3 py-2 border border-gray-100"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  >
                    <span className="text-2xl">⏱️</span>
                    <p className="text-xs font-bold text-dark">~30min</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-block bg-primary-light text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                POR QUE DOAR?
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-6">
                Uma única doação pode salvar <span className="text-primary">até 4 vidas</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Cada bolsa de sangue é separada em componentes (hemácias, plaquetas e plasma)
                que ajudam diferentes pacientes. Seu gesto simples tem um impacto gigantesco.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { emoji: '🏥', text: 'Pacientes em cirurgias e tratamentos de câncer' },
                  { emoji: '🤰', text: 'Mães em partos de emergência' },
                  { emoji: '🚑', text: 'Vítimas de acidentes e traumas' },
                  { emoji: '👶', text: 'Crianças com doenças hematológicas' },
                ].map((item, i) => (
                  <motion.div
                    key={item.text}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Como doar — guia para iniciantes */}
      <section id="como-doar" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              PRIMEIRA VEZ?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark">Como doar sangue</h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
              Nunca doou? Sem problema! Veja o passo a passo completo de como funciona o processo.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-red-300 to-primary-light hidden sm:block" />

              {[
                {
                  step: '01',
                  title: 'Procure um hemocentro',
                  description: 'Vá ao Hemoal mais próximo de você (Maceió ou Arapiraca). Não precisa agendar — basta ir no horário de funcionamento com um documento com foto.',
                  tip: 'Seg a Sex: 7h às 18h | Sáb: 7h às 13h',
                  color: 'bg-red-100 text-red-600',
                },
                {
                  step: '02',
                  title: 'Triagem e entrevista',
                  description: 'Ao chegar, você passará por uma triagem clínica: verificação de pressão, temperatura, peso e hemoglobina. Depois, uma entrevista confidencial sobre seu histórico de saúde.',
                  tip: 'Tudo é sigiloso e feito por profissionais de saúde',
                  color: 'bg-orange-100 text-orange-600',
                },
                {
                  step: '03',
                  title: 'A doação em si',
                  description: 'O processo leva de 8 a 15 minutos. São coletados cerca de 450ml de sangue (menos de 10% do total do corpo). Você fica sentado confortavelmente o tempo todo.',
                  tip: 'Dica: beba bastante água antes e depois',
                  color: 'bg-blue-100 text-blue-600',
                },
                {
                  step: '04',
                  title: 'Lanche e descanso',
                  description: 'Após a doação, você recebe um lanche e descansa por 15 minutos. O hemocentro oferece suco e biscoitos. Evite esforço físico pesado nas próximas 12 horas.',
                  tip: 'Você pode voltar a doar em 60 dias (homens) ou 90 dias (mulheres)',
                  color: 'bg-green-100 text-green-600',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  className="flex gap-4 sm:gap-6 mb-8 last:mb-0"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                >
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0 relative z-10`}>
                    {item.step}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-2xl p-5 hover:bg-gray-100/70 transition-colors">
                    <h3 className="text-lg font-bold text-dark mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{item.description}</p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-white rounded-lg px-3 py-2 w-fit">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                      {item.tip}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-500 mb-4">Tem mais dúvidas sobre doação?</p>
              <Link to="/education">
                <Button variant="primary" size="lg" rightIcon={<ChevronRight className="w-5 h-5" />}>
                  Ver guia completo
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quem pode doar */}
      <section id="requisitos" className="py-20 sm:py-28 bg-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-green-100 text-green-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              REQUISITOS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark">Quem pode doar?</h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
              Confira os requisitos básicos para se tornar um doador de sangue.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col gap-4">
              {requirements.map((req, index) => (
                <motion.div
                  key={req}
                  className="flex items-center gap-4 bg-green-50 rounded-xl px-5 py-4 hover:bg-green-100/70 transition-colors cursor-default"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12, type: 'spring', stiffness: 100 }}
                  whileHover={{ scale: 1.02, x: 8 }}
                >
                  <motion.div
                    className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.12 + 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <Check className="w-5 h-5 text-green-600" />
                  </motion.div>
                  <span className="text-gray-700 font-medium">{req}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hemocentros */}
      <section id="hemocentros" className="py-20 sm:py-28 bg-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-primary-light text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              PARCEIROS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark">Hemocentros parceiros</h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
              Encontre o hemocentro mais próximo de você e agende sua doação.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {bloodCenters.map((center, index) => (
              <motion.div
                key={center.name}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-dark">{center.name}</h3>
                </div>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                    <span>{center.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 shrink-0 text-gray-400" />
                    <span>{center.phone}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{center.hours}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-red-500 to-coral" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-white/15 backdrop-blur-sm rounded-full mb-8"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
              Pronto para salvar vidas?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
              Junte-se a centenas de estudantes que já estão fazendo a diferença.
              Sua primeira doação pode salvar até 4 vidas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white !text-primary hover:bg-gray-50 shadow-lg shadow-black/20 border-white"
                  rightIcon={<ChevronRight className="w-5 h-5" />}
                >
                  Começar agora
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Shield className="w-4 h-4" />
                <span>100% gratuito e seguro</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Universidades */}
      <section className="bg-gradient-to-r from-primary via-red-500 to-coral py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GraduationCap className="w-12 h-12 text-white/80 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Leve o Sangue Vivo para sua universidade
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Sua instituição pode fazer parte dessa rede de solidariedade. Cadastre sua universidade
              na plataforma e incentive seus alunos a salvarem vidas. O processo é simples e gratuito.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:contato@sanguevivo.al.gov.br">
                <Button
                  size="lg"
                  variant="ghost"
                  className="!bg-white !text-red-600 hover:!bg-gray-100 !shadow-lg"
                  leftIcon={<Mail className="w-5 h-5" />}
                >
                  Quero aderir minha universidade
                </Button>
              </a>
              <a href="https://wa.me/5582933152102" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="ghost"
                  className="!border-2 !border-white !text-white hover:!bg-white/10"
                >
                  Falar pelo WhatsApp
                </Button>
              </a>
            </div>
            <p className="text-white/50 text-sm mt-6">
              Já são 9 universidades parceiras em Alagoas
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold">Sangue Vivo</span>
              </div>
              <p className="text-gray-400 text-sm">
                Conectando estudantes universitários de Alagoas aos hemocentros da região.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Plataforma</h4>
              <ul className="flex flex-col gap-2 text-sm text-gray-400">
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a></li>
                <li><a href="#requisitos" className="hover:text-white transition-colors">Quem pode doar</a></li>
                <li><a href="#hemocentros" className="hover:text-white transition-colors">Hemocentros</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Institucional</h4>
              <ul className="flex flex-col gap-2 text-sm text-gray-400">
                <li><a href="mailto:contato@sanguevivo.al.gov.br" className="hover:text-white transition-colors">Aderir minha universidade</a></li>
                <li><a href="#requisitos" className="hover:text-white transition-colors">Quem pode doar</a></li>
                <li><a href="mailto:contato@sanguevivo.al.gov.br" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Hemocentros parceiros</h4>
              <ul className="flex flex-col gap-2 text-sm text-gray-400">
                <li>Hemoal Maceió</li>
                <li>Hemoal Arapiraca</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              Feito com <motion.span
                className="inline-block"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.2 }}
              ><Heart className="inline w-4 h-4 text-primary" /></motion.span> em Alagoas
            </p>
            <p className="text-gray-600 text-xs">
              Sangue Vivo &copy; 2026. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
