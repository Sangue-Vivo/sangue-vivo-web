import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Save,
  LogOut,
  Bell,
  Lock,
  Eye,
  EyeOff,
  User,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';
import { mapUser, apiErrorMessage } from '../services/mappers';

const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  university: z.string().min(1, 'Selecione sua universidade'),
  course: z.string().min(1, 'Informe seu curso'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: z
      .string()
      .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'Deve conter pelo menos um número')
      .regex(/[^a-zA-Z0-9]/, 'Deve conter pelo menos um caractere especial'),
    confirmPassword: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const universities = [
  { value: 'UFAL — Universidade Federal de Alagoas', label: 'UFAL - Universidade Federal de Alagoas' },
  { value: 'UNEAL — Universidade Estadual de Alagoas', label: 'UNEAL - Universidade Estadual de Alagoas' },
  { value: 'CESMAC — Centro Universitário CESMAC', label: 'CESMAC - Centro Universitário CESMAC' },
  { value: 'UNIT — Universidade Tiradentes', label: 'UNIT - Universidade Tiradentes' },
  { value: 'FITS — Faculdade Integrada Tiradentes', label: 'FITS - Faculdade Integrada Tiradentes' },
  { value: 'UNINASSAU', label: 'UNINASSAU - Centro Universitário Maurício de Nassau' },
  { value: 'Estácio de Sá', label: 'Estácio de Sá - Maceió' },
  { value: 'IFAL', label: 'IFAL - Instituto Federal de Alagoas' },
  { value: 'SEUNE', label: 'SEUNE - Faculdade de Ensino Regional Alternativa' },
  { value: 'UMJ', label: 'UMJ - Universidade Mário Pontes Jucá' },
];

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    eligibleToDonate: true,
    donationReminder: true,
    causeMatch: true,
    general: false,
  });

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      university: user?.university ?? '',
      course: user?.course ?? '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setProfileError('');
    setProfileSaving(true);
    try {
      const res = await api.put('/users/profile', data);
      useAuthStore.getState().setUser(mapUser(res.data.data.user));
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      setProfileError(apiErrorMessage(err, 'Não foi possível salvar o perfil.'));
    } finally {
      setProfileSaving(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setPasswordError('');
    setPasswordSaving(true);
    try {
      await api.put('/users/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPasswordSaved(true);
      resetPassword();
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err) {
      setPasswordError(apiErrorMessage(err, 'Não foi possível alterar a senha.'));
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!user) return null;

  return (
    <PageContainer
      title="Configurações"
      breadcrumbs={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Configurações' },
      ]}
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        {/* Profile Edit */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-dark">Dados do perfil</h2>
            </div>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="flex flex-col gap-4">
              {profileError && (
                <motion.div
                  className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {profileError}
                </motion.div>
              )}
              <Input
                label="Nome completo"
                error={profileErrors.name?.message}
                {...registerProfile('name')}
              />
              <Input
                label="Telefone"
                placeholder="(82) 99999-9999"
                error={profileErrors.phone?.message}
                {...registerProfile('phone')}
              />
              <Select
                label="Universidade"
                options={universities}
                error={profileErrors.university?.message}
                {...registerProfile('university')}
              />
              <Input
                label="Curso"
                error={profileErrors.course?.message}
                {...registerProfile('course')}
              />
              <div className="flex items-center gap-3">
                <Button type="submit" isLoading={profileSaving} leftIcon={<Save className="w-4 h-4" />}>
                  Salvar alterações
                </Button>
                {profileSaved && (
                  <motion.span
                    className="text-sm text-green-600 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Perfil atualizado!
                  </motion.span>
                )}
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-dark">Notificações</h2>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { key: 'eligibleToDonate' as const, label: 'Apto para doar', desc: 'Receber aviso quando estiver apto a doar novamente' },
                { key: 'donationReminder' as const, label: 'Lembrete de doação', desc: 'Lembrete antes da doação agendada' },
                { key: 'causeMatch' as const, label: 'Alertas de estoque', desc: 'Alertas de estoque compatíveis com seu tipo sanguíneo' },
                { key: 'general' as const, label: 'Novidades gerais', desc: 'Atualizações e novidades da plataforma' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-dark">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotification(item.key)}
                    className={`
                      relative w-11 h-6 rounded-full transition-colors cursor-pointer
                      ${notifications[item.key] ? 'bg-primary' : 'bg-gray-300'}
                    `}
                  >
                    <div
                      className={`
                        absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform
                        ${notifications[item.key] ? 'translate-x-5.5' : 'translate-x-0.5'}
                      `}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-dark">Alterar senha</h2>
            </div>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="flex flex-col gap-4">
              {passwordError && (
                <motion.div
                  className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {passwordError}
                </motion.div>
              )}
              <Input
                label="Senha atual"
                type={showCurrentPassword ? 'text' : 'password'}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                error={passwordErrors.currentPassword?.message}
                {...registerPassword('currentPassword')}
              />
              <Input
                label="Nova senha"
                type={showNewPassword ? 'text' : 'password'}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                error={passwordErrors.newPassword?.message}
                {...registerPassword('newPassword')}
              />
              <Input
                label="Confirmar nova senha"
                type="password"
                error={passwordErrors.confirmPassword?.message}
                {...registerPassword('confirmPassword')}
              />
              <div className="flex items-center gap-3">
                <Button type="submit" isLoading={passwordSaving} leftIcon={<Lock className="w-4 h-4" />}>
                  Alterar senha
                </Button>
                {passwordSaved && (
                  <motion.span
                    className="text-sm text-green-600 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Senha alterada!
                  </motion.span>
                )}
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button
            variant="danger"
            fullWidth
            size="lg"
            leftIcon={<LogOut className="w-5 h-5" />}
            onClick={handleLogout}
          >
            Sair da conta
          </Button>
        </motion.div>
      </div>
    </PageContainer>
  );
}
