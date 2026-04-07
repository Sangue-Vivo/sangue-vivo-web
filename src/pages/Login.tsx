import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Droplets, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('Informe um e-mail válido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Erro ao fazer login. Tente novamente.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-warm flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
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
          <h1 className="text-2xl font-bold text-dark">Sangue Vivo</h1>
          <p className="text-gray-500 mt-1">Entre na sua conta para continuar</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {authError && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {authError}
              </motion.div>
            )}

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              leftIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary font-medium hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Entrar
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Não tem conta?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Criar conta
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
