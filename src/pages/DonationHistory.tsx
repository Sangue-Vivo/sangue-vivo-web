import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Droplets,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  Link2,
  CalendarPlus,
  AlertTriangle,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import PageContainer from '../components/layout/PageContainer';
import { useDonations } from '../hooks/useDonations';
import { formatDate } from '../utils/formatters';
import { DonationStatus } from '../types';

const statusConfig: Record<
  DonationStatus,
  { label: string; variant: 'success' | 'info' | 'danger' | 'warning'; icon: React.ElementType }
> = {
  [DonationStatus.COMPLETED]: { label: 'Concluída', variant: 'success', icon: CheckCircle2 },
  [DonationStatus.SCHEDULED]: { label: 'Agendada', variant: 'info', icon: Clock },
  [DonationStatus.CANCELLED]: { label: 'Cancelada', variant: 'danger', icon: XCircle },
  [DonationStatus.NO_SHOW]: { label: 'Não compareceu', variant: 'warning', icon: XCircle },
};

type HistoryFilter = 'all' | 'completed' | 'cancelled';

export default function DonationHistory() {
  const { donations, stats, cancelDonation } = useDonations();
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all');

  const scheduledDonations = useMemo(() => {
    return donations
      .filter((d) => d.status === DonationStatus.SCHEDULED)
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }, [donations]);

  const pastDonations = useMemo(() => {
    let past = donations.filter((d) => d.status !== DonationStatus.SCHEDULED);

    if (historyFilter === 'completed') {
      past = past.filter((d) => d.status === DonationStatus.COMPLETED);
    } else if (historyFilter === 'cancelled') {
      past = past.filter(
        (d) => d.status === DonationStatus.CANCELLED || d.status === DonationStatus.NO_SHOW
      );
    }

    return past.sort(
      (a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    );
  }, [donations, historyFilter]);

  const getDaysUntil = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const formatFullDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const filterTabs: { key: HistoryFilter; label: string }[] = [
    { key: 'all', label: 'Todas' },
    { key: 'completed', label: 'Concluídas' },
    { key: 'cancelled', label: 'Canceladas' },
  ];

  return (
    <PageContainer
      title="Minhas Doações"
      breadcrumbs={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Minhas Doações' },
      ]}
    >
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {/* Stats summary */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[
            { label: 'Realizadas', value: stats.totalCompleted, color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle2 },
            { label: 'Agendadas', value: stats.totalScheduled, color: 'text-blue-600', bg: 'bg-blue-100', icon: Clock },
            { label: 'Vidas que poderão ser salvas', value: stats.potentialLivesSaved, color: 'text-coral', bg: 'bg-orange-50', icon: Droplets },
          ].map((s) => (
            <Card key={s.label} className="text-center p-4">
              <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-xl font-bold text-dark">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* ========== SCHEDULED DONATIONS ========== */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-dark">Próximas doações</h2>
            {scheduledDonations.length > 0 && (
              <span className="ml-auto text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {scheduledDonations.length} agendada{scheduledDonations.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {scheduledDonations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="text-center py-10">
                <CalendarPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-gray-500">Nenhuma doação agendada</h3>
                <p className="text-sm text-gray-400 mt-1 mb-4">
                  Encontre uma causa e agende sua próxima doação.
                </p>
                <Link to="/causes">
                  <Button size="sm">Ver causas</Button>
                </Link>
              </Card>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4">
              {scheduledDonations.map((donation, index) => {
                const daysUntil = getDaysUntil(donation.scheduledDate);
                const hasCause = donation.causeDonation !== null;

                return (
                  <motion.div
                    key={donation.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-l-4 border-l-blue-500">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Date badge */}
                        <div className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-1 shrink-0">
                          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex flex-col items-center justify-center">
                            <span className="text-lg font-bold text-blue-700 leading-none">
                              {new Date(donation.scheduledDate).getDate()}
                            </span>
                            <span className="text-[10px] font-semibold text-blue-500 uppercase">
                              {new Date(donation.scheduledDate).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                            </span>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            daysUntil <= 3
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-50 text-blue-600'
                          }`}>
                            {daysUntil === 0
                              ? 'Hoje!'
                              : daysUntil === 1
                              ? 'Amanhã'
                              : `em ${daysUntil} dias`}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="info" size="sm">
                              <Clock className="w-3 h-3 mr-1" />
                              Agendada
                            </Badge>
                            {daysUntil <= 1 && (
                              <Badge variant="warning" size="sm">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Próxima
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-sm font-semibold text-dark mt-2">
                            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="truncate">{donation.hospital}</span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="capitalize">{formatFullDate(donation.scheduledDate)}</span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{donation.city}</span>
                          </div>

                          {hasCause && donation.causeDonation && (
                            <Link
                              to={`/causes/${donation.causeDonation.causeId}`}
                              className="flex items-center gap-1 mt-2 text-xs text-primary font-medium hover:underline"
                            >
                              <Link2 className="w-3.5 h-3.5" />
                              Ver causa vinculada
                            </Link>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="shrink-0">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => cancelDonation(donation.id)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* ========== HISTORY ========== */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-dark">Histórico</h2>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-4">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setHistoryFilter(tab.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  historyFilter === tab.key
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-primary/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {pastDonations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Droplets className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-base font-semibold text-gray-500">Nenhuma doação neste filtro</h3>
              <p className="text-sm text-gray-400 mt-1">
                {historyFilter === 'all'
                  ? 'Suas doações passadas aparecerão aqui.'
                  : 'Tente outro filtro.'}
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

              <div className="flex flex-col gap-4">
                {pastDonations.map((donation, index) => {
                  const config = statusConfig[donation.status];
                  const StatusIcon = config.icon;
                  const date = donation.completedDate || donation.scheduledDate;
                  const hasCause = donation.causeDonation !== null;

                  return (
                    <motion.div
                      key={donation.id}
                      className="relative pl-14"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div
                        className={`absolute left-4 top-5 w-5 h-5 rounded-full border-2 bg-white z-10 flex items-center justify-center ${
                          donation.status === DonationStatus.COMPLETED
                            ? 'border-green-500'
                            : 'border-red-400'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            donation.status === DonationStatus.COMPLETED
                              ? 'bg-green-500'
                              : 'bg-red-400'
                          }`}
                        />
                      </div>

                      <Card className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <Badge variant={config.variant} size="sm">
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {config.label}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-1.5 text-sm text-gray-700 font-medium">
                              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className="truncate">{donation.hospital}</span>
                            </div>

                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{formatDate(date)}</span>
                              <span>&middot;</span>
                              <span>{donation.city}</span>
                            </div>

                            {hasCause && donation.causeDonation && (
                              <Link
                                to={`/causes/${donation.causeDonation.causeId}`}
                                className="flex items-center gap-1 mt-2 text-xs text-primary font-medium hover:underline"
                              >
                                <Link2 className="w-3.5 h-3.5" />
                                Ver causa vinculada
                              </Link>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
