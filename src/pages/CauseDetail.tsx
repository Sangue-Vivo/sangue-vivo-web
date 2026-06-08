import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  AlertTriangle,
  CalendarPlus,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import BloodTypeBadge from '../components/ui/BloodTypeBadge';
import Badge from '../components/ui/Badge';
import PageContainer from '../components/layout/PageContainer';
import SchedulingModal from '../components/donation/SchedulingModal';
import { useCauses } from '../hooks/useCauses';
import { useDonations } from '../hooks/useDonations';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatters';
import { BLOOD_TYPE_LABELS } from '../utils/bloodTypes';
import type { Cause } from '../types';
import { apiErrorMessage } from '../services/mappers';

function getStockLevel(urgencyLevel: number) {
  if (urgencyLevel >= 4) return { label: 'Crítico', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-100' };
  if (urgencyLevel === 3) return { label: 'Baixo', color: 'bg-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-100' };
  if (urgencyLevel === 2) return { label: 'Moderado', color: 'bg-yellow-400', textColor: 'text-yellow-700', bgLight: 'bg-yellow-100' };
  return { label: 'Estável', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-100' };
}

export default function CauseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCauseById } = useCauses();
  const { scheduleDonation } = useDonations();
  const { user } = useAuth();
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [cause, setCause] = useState<Cause | null>(null);
  const [loadingCause, setLoadingCause] = useState(true);

  useEffect(() => {
    let active = true;
    setLoadingCause(true);
    getCauseById(id ?? '').then((c) => {
      if (active) {
        setCause(c);
        setLoadingCause(false);
      }
    });
    return () => {
      active = false;
    };
  }, [id, getCauseById]);

  if (loadingCause) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <Clock className="w-6 h-6 text-gray-300 animate-spin" />
        </div>
      </PageContainer>
    );
  }

  if (!cause) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-xl font-bold text-dark">Alerta não encontrado</h2>
          <p className="text-gray-500 mt-2">Este alerta pode ter sido removido ou não existe.</p>
          <Link to="/causes" className="mt-4">
            <Button variant="secondary">Voltar para alertas</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const stockLevel = getStockLevel(cause.urgencyLevel);
  const userBloodType = user?.bloodType;

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Voltar</span>
        </button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-2xl font-bold text-dark">{cause.title}</h1>
                {cause.urgencyLevel >= 4 && (
                  <Badge variant="danger" className="shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                    Urgente
                  </Badge>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed">{cause.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{cause.hospital} &middot; {cause.city}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Expira em {formatDate(cause.expiresAt)}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stock Level Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <h2 className="text-lg font-bold text-dark mb-4">Nível de estoque</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stockLevel.color} transition-all`}
                    style={{ width: `${Math.max(10, (5 - cause.urgencyLevel) * 25)}%` }}
                  />
                </div>
              </div>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${stockLevel.bgLight} ${stockLevel.textColor}`}>
                {stockLevel.label}
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Blood Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h2 className="text-lg font-bold text-dark mb-4">Tipos sanguíneos necessários</h2>
            <div className="flex flex-wrap gap-2">
              {cause.bloodTypesNeeded.map((bt) => (
                <div key={bt} className="relative">
                  <BloodTypeBadge
                    bloodType={bt}
                    className={`text-base px-4 py-2 ${
                      userBloodType === bt
                        ? 'ring-2 ring-primary ring-offset-2'
                        : ''
                    }`}
                  />
                  {userBloodType === bt && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      Você
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-3">
              {cause.bloodTypesNeeded.length === 1
                ? `Tipo sanguíneo necessário: ${BLOOD_TYPE_LABELS[cause.bloodTypesNeeded[0]]}`
                : `${cause.bloodTypesNeeded.length} tipos sanguíneos necessários`}
            </p>
          </Card>
        </motion.div>

        {/* Blood Center Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <h2 className="text-lg font-bold text-dark mb-4">Hemocentro</h2>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{cause.hospital} &middot; {cause.city}</span>
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="sticky bottom-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-primary to-coral border-0 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-white">
                <h3 className="font-bold text-lg">Faça a diferença!</h3>
                <p className="text-white/80 text-sm">Agende sua doação e ajude a manter os estoques dos hemocentros.</p>
              </div>
              <Button
                size="lg"
                className="!bg-white !text-primary hover:!bg-gray-50 shrink-0 !shadow-none"
                leftIcon={<CalendarPlus className="w-5 h-5" />}
                onClick={() => setShowSchedulingModal(true)}
              >
                Quero ajudar — agendar doação
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <SchedulingModal
        isOpen={showSchedulingModal}
        onClose={() => setShowSchedulingModal(false)}
        cause={cause}
        onConfirm={async (data) => {
          try {
            await scheduleDonation({
              scheduledDate: data.scheduledDate,
              hospital: data.hospital,
              city: data.city,
              causeId: cause.id,
            });
            toast.success('Doação agendada com sucesso!');
          } catch (err) {
            toast.error(apiErrorMessage(err, 'Não foi possível agendar a doação.'));
          }
        }}
      />
    </PageContainer>
  );
}
