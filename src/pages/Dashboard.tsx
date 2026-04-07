import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarPlus,
  Search,
  UserCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  MapPin,
  Calendar,
  Droplets,
  Heart,
} from 'lucide-react';
import { DonationStatus } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';

import CauseCard from '../components/cause/CauseCard';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../hooks/useAuth';
import { useDonations } from '../hooks/useDonations';
import { useCauses } from '../hooks/useCauses';
import { formatDate, formatBloodType } from '../utils/formatters';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, donations } = useDonations();
  const { compatibleCauses } = useCauses();

  if (!user) return null;

  const isEligible = user.isEligible;
  const nextEligibleDate = user.nextEligibleDate;

  const daysUntilEligible = nextEligibleDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(nextEligibleDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const scheduledDonations = donations
    .filter((d) => d.status === DonationStatus.SCHEDULED)
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  const firstName = user.name.split(' ')[0];

  const nextDonationLabel = isEligible
    ? 'Você já pode doar!'
    : nextEligibleDate
    ? formatDate(nextEligibleDate)
    : '—';

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Greeting */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <Avatar name={user.name} bloodType={user.bloodType} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-dark">Olá, {firstName}!</h1>
              <p className="text-gray-500 text-sm">
                Bem-vindo de volta ao Sangue Vivo
              </p>
            </div>
          </div>
        </motion.div>

        {/* Eligibility Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isEligible ? (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-green-800">Você pode doar!</h3>
                  <p className="text-sm text-green-600">
                    Você está apto para realizar uma doação de sangue.
                  </p>
                </div>
                <Link to="/causes">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Agendar
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-7 h-7 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-800">Próxima doação em {daysUntilEligible} dias</h3>
                  <p className="text-sm text-amber-600">
                    {nextEligibleDate
                      ? `Você poderá doar novamente em ${formatDate(nextEligibleDate)}`
                      : 'Aguardando período de carência'}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {[
            { icon: Droplets, label: 'Doações realizadas', value: stats.totalCompleted, color: 'text-primary', bg: 'bg-primary-light' },
            { icon: Heart, label: 'Vidas que poderão ser salvas', value: stats.potentialLivesSaved, color: 'text-coral', bg: 'bg-orange-50' },
            { icon: Calendar, label: 'Próxima doação', value: nextDonationLabel, color: 'text-info', bg: 'bg-blue-50' },
            { icon: Droplets, label: 'Tipo sanguíneo', value: user.bloodType ? formatBloodType(user.bloodType) : 'Não informado', color: 'text-primary', bg: 'bg-primary-light' },
          ].map((stat) => (
            <Card key={stat.label} className="text-center p-4">
              <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-lg font-bold text-dark">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Compatible Causes */}
        {compatibleCauses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4 gap-4">
              <h2 className="text-lg font-bold text-dark whitespace-nowrap">Alertas compatíveis com você</h2>
              <Link to="/causes" className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline shrink-0">
                Ver todos <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
              {compatibleCauses.slice(0, 3).map((cause) => (
                <div key={cause.id} className="min-w-[300px] snap-start">
                  <CauseCard
                    cause={cause}
                    onHelp={(id) => navigate(`/causes/${id}`)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Donations */}
        {scheduledDonations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4 gap-4">
              <h2 className="text-lg font-bold text-dark whitespace-nowrap">Próximas doações</h2>
              <Link to="/donations" className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline shrink-0">
                Ver todas <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {scheduledDonations.slice(0, 3).map((donation, index) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <p className="text-sm font-semibold text-dark truncate">{donation.hospital}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(donation.scheduledDate)} · {donation.city}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full shrink-0">
                      <Clock className="w-3 h-3" />
                      Agendada
                    </span>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-dark mb-4">Ações rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/causes">
              <Card hoverable className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center">
                  <CalendarPlus className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold text-dark text-sm">Agendar Doação</span>
              </Card>
            </Link>
            <Link to="/causes">
              <Card hoverable className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-coral" />
                </div>
                <span className="font-semibold text-dark text-sm">Ver Alertas</span>
              </Card>
            </Link>
            <Link to="/profile">
              <Card hoverable className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-info" />
                </div>
                <span className="font-semibold text-dark text-sm">Meu Perfil</span>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
