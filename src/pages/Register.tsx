import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Mail, Lock, Eye, EyeOff, User, Calendar, CreditCard, Info } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';
import EligibilityChecklist from '../components/ui/EligibilityChecklist';
import { BloodType, Gender } from '../types';
import { BLOOD_TYPE_LABELS } from '../utils/bloodTypes';
import { useAuth } from '../hooks/useAuth';

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function isValidCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  return remainder === parseInt(digits[10]);
}

const DONT_KNOW = 'DONT_KNOW' as const;

const registerSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().min(1, 'E-mail é obrigatório').email('Informe um e-mail válido'),
    cpf: z
      .string()
      .min(1, 'CPF é obrigatório')
      .refine((val) => isValidCpf(val), 'CPF inválido'),
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'Deve conter pelo menos um número')
      .regex(/[^a-zA-Z0-9]/, 'Deve conter pelo menos um caractere especial'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
    bloodType: z.union([z.nativeEnum(BloodType), z.literal(DONT_KNOW)]).optional(),
    gender: z.nativeEnum(Gender, { message: 'Selecione seu gênero' }),
    birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
    university: z.string().min(1, 'Selecione sua universidade'),
    course: z.string().min(1, 'Informe seu curso'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'Você deve aceitar os Termos de Uso e a Política de Privacidade' }),
    }),
    acceptLgpd: z.literal(true, {
      errorMap: () => ({ message: 'Você deve autorizar o uso dos seus dados conforme a LGPD' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const bloodTypeOptions: { value: BloodType; label: string }[] = Object.entries(
  BLOOD_TYPE_LABELS
).map(([value, label]) => ({ value: value as BloodType, label }));

const genderOptions = [
  { value: Gender.MALE, label: 'Masculino' },
  { value: Gender.FEMALE, label: 'Feminino' },
  { value: Gender.OTHER, label: 'Outro' },
];

const universities = [
  // Públicas
  { value: 'UFAL', label: 'UFAL - Universidade Federal de Alagoas' },
  { value: 'UNEAL', label: 'UNEAL - Universidade Estadual de Alagoas' },
  { value: 'UNCISAL', label: 'UNCISAL - Universidade Estadual de Ciências da Saúde de Alagoas' },
  { value: 'IFAL', label: 'IFAL - Instituto Federal de Alagoas' },
  // Privadas
  { value: 'CESMAC', label: 'CESMAC - Centro Universitário CESMAC' },
  { value: 'UNIT', label: 'UNIT - Universidade Tiradentes' },
  { value: 'FITS', label: 'FITS - Faculdade Integrada Tiradentes' },
  { value: 'UNINASSAU', label: 'UNINASSAU - Centro Universitário Maurício de Nassau' },
  { value: 'ESTACIO', label: 'Estácio de Sá - Maceió' },
  { value: 'FACIMA', label: 'FACIMA - Faculdade da Cidade de Maceió' },
  { value: 'FAA', label: 'FAA - Faculdade Alagoana de Administração' },
  { value: 'SEUNE', label: 'SEUNE - Faculdade de Ensino Regional Alternativa' },
  { value: 'FRM', label: 'FRM - Faculdade Raimundo Marinho' },
  { value: 'MADRE_TEREZA', label: 'Faculdade Madre Tereza' },
  { value: 'UMJ', label: 'UMJ - Universidade Mário Pontes Jucá' },
  { value: 'ANHANGUERA', label: 'Anhanguera - Maceió' },
  { value: 'SAO_MARCOS', label: 'Faculdade São Marcos' },
  { value: 'OUTRO', label: 'Outra (digitar)' },
];

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [showCustomUniversity, setShowCustomUniversity] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: undefined,
      acceptLgpd: undefined,
    },
  });

  const bloodTypeValue = watch('bloodType');
  const dontKnowBloodType = bloodTypeValue === DONT_KNOW;

  const onSubmit = async (data: RegisterFormData) => {
    setFormData(data);
    setShowChecklist(true);
  };

  const finishRegistration = async () => {
    if (!formData) return;
    try {
      setRegisterError('');
      await registerUser({
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        password: formData.password,
        bloodType: formData.bloodType === DONT_KNOW ? undefined : formData.bloodType,
        gender: formData.gender,
        birthDate: formData.birthDate,
        university: formData.university,
        course: formData.course,
      });
      navigate('/onboarding');
    } catch (err) {
      setRegisterError(
        err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.'
      );
      setShowChecklist(false);
    }
  };

  if (showChecklist) {
    return (
      <div className="min-h-screen bg-warm flex items-center justify-center p-4 py-8">
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Droplets className="w-7 h-7 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-dark">Checklist de Elegibilidade</h1>
            <p className="text-gray-500 mt-1">Vamos verificar se você pode doar sangue</p>
          </div>

          <EligibilityChecklist
            mode="register"
            onComplete={() => finishRegistration()}
            onSkip={() => finishRegistration()}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm flex items-center justify-center p-4 py-8">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Droplets className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-dark">Criar sua conta</h1>
          <p className="text-gray-500 mt-1">Junte-se à comunidade Sangue Vivo</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {registerError && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {registerError}
              </motion.div>
            )}

            <Input
              label="Nome completo"
              placeholder="Seu nome completo"
              leftIcon={<User className="w-5 h-5" />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@universidade.edu.br"
              leftIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Controller
              name="cpf"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  label="CPF"
                  placeholder="000.000.000-00"
                  leftIcon={<CreditCard className="w-5 h-5" />}
                  error={errors.cpf?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(formatCpf(e.target.value))}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 caracteres"
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />
              <Input
                label="Confirmar senha"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repita a senha"
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            {/* Blood Type Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Tipo sanguíneo</label>
              <Controller
                name="bloodType"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-4 gap-2">
                      {bloodTypeOptions.map((bt) => (
                        <button
                          key={bt.value}
                          type="button"
                          onClick={() => field.onChange(bt.value)}
                          className={`
                            py-3 rounded-xl text-sm font-bold transition-all border-2 cursor-pointer
                            ${
                              field.value === bt.value
                                ? 'bg-primary text-white border-primary shadow-md scale-105'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-primary/50'
                            }
                          `}
                        >
                          {bt.label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => field.onChange(DONT_KNOW)}
                      className={`
                        w-full py-2.5 rounded-xl text-sm font-semibold transition-all border-2 cursor-pointer
                        ${
                          field.value === DONT_KNOW
                            ? 'bg-amber-50 text-amber-700 border-amber-400 shadow-sm'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-amber-300 hover:text-amber-600'
                        }
                      `}
                    >
                      Não sei meu tipo sanguíneo
                    </button>
                  </div>
                )}
              />
              <AnimatePresence>
                {dontKnowBloodType && (
                  <motion.div
                    className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-700 space-y-2">
                        <p>
                          <strong>Tudo bem!</strong> Você pode descobrir seu tipo sanguíneo
                          gratuitamente no hemocentro mais próximo. Na sua primeira doação, eles
                          farão a tipagem do seu sangue.
                        </p>
                        <p>
                          Você também pode consultar seu cartão de vacinação ou perguntar ao seu
                          médico.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {errors.bloodType && (
                <p className="text-sm text-danger font-medium">{errors.bloodType.message}</p>
              )}
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Gênero</label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-2">
                    {genderOptions.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => field.onChange(g.value)}
                        className={`
                          py-2.5 rounded-xl text-sm font-semibold transition-all border-2 cursor-pointer
                          ${
                            field.value === g.value
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-primary/50'
                          }
                        `}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                )}
              />
              {errors.gender && (
                <p className="text-sm text-danger font-medium">{errors.gender.message}</p>
              )}
            </div>

            <Input
              label="Data de nascimento"
              type="date"
              leftIcon={<Calendar className="w-5 h-5" />}
              error={errors.birthDate?.message}
              {...register('birthDate')}
            />

            <Controller
              name="university"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Select
                    label="Universidade"
                    placeholder="Selecione sua universidade"
                    options={universities}
                    error={!showCustomUniversity ? errors.university?.message : undefined}
                    value={showCustomUniversity ? 'OUTRO' : field.value}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'OUTRO') {
                        setShowCustomUniversity(true);
                        field.onChange('');
                      } else {
                        setShowCustomUniversity(false);
                        field.onChange(val);
                      }
                    }}
                    name="university_select"
                  />
                  {showCustomUniversity && (
                    <Input
                      placeholder="Digite o nome da sua faculdade"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      error={errors.university?.message}
                    />
                  )}
                </div>
              )}
            />

            <Input
              label="Curso"
              placeholder="Ex: Medicina, Enfermagem..."
              error={errors.course?.message}
              {...register('course')}
            />

            {/* LGPD Consent Checkboxes */}
            <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-[#E53935]"
                  {...register('acceptTerms')}
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-600 cursor-pointer">
                  Li e concordo com os{' '}
                  <Link to="/terms" target="_blank" className="text-primary font-semibold hover:underline">
                    Termos de Uso
                  </Link>{' '}
                  e a{' '}
                  <Link to="/privacy" target="_blank" className="text-primary font-semibold hover:underline">
                    Política de Privacidade
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-danger font-medium ml-7">{errors.acceptTerms.message}</p>
              )}

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptLgpd"
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-[#E53935]"
                  {...register('acceptLgpd')}
                />
                <label htmlFor="acceptLgpd" className="text-sm text-gray-600 cursor-pointer">
                  Autorizo o uso dos meus dados pessoais conforme a Lei Geral de Proteção de Dados
                  (LGPD) para as finalidades descritas na{' '}
                  <Link to="/privacy" target="_blank" className="text-primary font-semibold hover:underline">
                    Política de Privacidade
                  </Link>
                </label>
              </div>
              {errors.acceptLgpd && (
                <p className="text-sm text-danger font-medium ml-7">{errors.acceptLgpd.message}</p>
              )}
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
              Criar conta
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
