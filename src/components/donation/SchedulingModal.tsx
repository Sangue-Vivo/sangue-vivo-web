import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarPlus, MapPin, Clock, CheckCircle2, Droplets } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import type { Cause } from '../../types';
import { BLOOD_TYPE_LABELS } from '../../utils/bloodTypes';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cause: Cause;
  onConfirm: (data: { scheduledDate: Date; hospital: string; city: string }) => void;
}

const hospitals = [
  { name: 'Hemoal Maceió', city: 'Maceió' },
  { name: 'Hemoal Arapiraca', city: 'Arapiraca' },
  { name: 'Hospital Universitário Prof. Alberto Antunes', city: 'Maceió' },
  { name: 'HEMO — Hemocentro de Alagoas', city: 'Maceió' },
];

type Step = 'form' | 'confirm' | 'success';

export default function SchedulingModal({
  isOpen,
  onClose,
  cause,
  onConfirm,
}: SchedulingModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedHospitalData = hospitals.find((h) => h.name === selectedHospital);

  const resetAndClose = () => {
    setStep('form');
    setSelectedDate('');
    setSelectedTime('');
    setSelectedHospital('');
    setErrors({});
    onClose();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedDate) newErrors.date = 'Selecione uma data';
    if (!selectedTime) newErrors.time = 'Selecione um horário';
    if (!selectedHospital) newErrors.hospital = 'Selecione um hemocentro';

    if (selectedDate) {
      const chosen = new Date(selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (chosen < today) {
        newErrors.date = 'A data deve ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setStep('confirm');
    }
  };

  const handleConfirm = () => {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const date = new Date(selectedDate);
    date.setHours(hours, minutes);

    onConfirm({
      scheduledDate: date,
      hospital: selectedHospital,
      city: selectedHospitalData?.city ?? 'Maceió',
    });

    setStep('success');
  };

  const formatDisplayDate = () => {
    if (!selectedDate) return '';
    const date = new Date(selectedDate + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title={step !== 'success' ? 'Agendar Doação' : undefined}>
      {step === 'form' && (
        <div className="flex flex-col gap-5">
          {/* Cause info */}
          <div className="flex items-center gap-3 bg-primary-light rounded-xl p-3">
            <Droplets className="w-5 h-5 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-dark truncate">{cause.title}</p>
              <p className="text-xs text-gray-500">
                Tipos necessários: {cause.bloodTypesNeeded.map((bt) => BLOOD_TYPE_LABELS[bt]).join(', ')}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Data da doação</label>
            <div className="relative">
              <CalendarPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  errors.date ? 'border-red-400' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
          </div>

          {/* Time */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Horário</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none bg-white cursor-pointer ${
                  errors.time ? 'border-red-400' : 'border-gray-200'
                }`}
              >
                <option value="">Selecione o horário</option>
                <option value="07:00">07:00</option>
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
              </select>
            </div>
            {errors.time && <p className="text-xs text-red-500">{errors.time}</p>}
          </div>

          {/* Hospital */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Hemocentro</label>
            <div className="flex flex-col gap-2">
              {hospitals.map((h) => (
                <button
                  key={h.name}
                  type="button"
                  onClick={() => setSelectedHospital(h.name)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    selectedHospital === h.name
                      ? 'border-primary bg-primary-light'
                      : 'border-gray-200 hover:border-primary/30'
                  }`}
                >
                  <MapPin className={`w-4 h-4 shrink-0 ${
                    selectedHospital === h.name ? 'text-primary' : 'text-gray-400'
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      selectedHospital === h.name ? 'text-primary' : 'text-gray-700'
                    }`}>
                      {h.name}
                    </p>
                    <p className="text-xs text-gray-400">{h.city}</p>
                  </div>
                </button>
              ))}
            </div>
            {errors.hospital && <p className="text-xs text-red-500">{errors.hospital}</p>}
          </div>

          <Button size="lg" fullWidth onClick={handleNext}>
            Continuar
          </Button>
        </div>
      )}

      {step === 'confirm' && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-gray-500">Confirme os dados do agendamento:</p>

          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Causa</p>
                <p className="text-sm font-semibold text-dark">{cause.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarPlus className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Data e horário</p>
                <p className="text-sm font-semibold text-dark capitalize">
                  {formatDisplayDate()} às {selectedTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Hemocentro</p>
                <p className="text-sm font-semibold text-dark">{selectedHospital}</p>
                <p className="text-xs text-gray-400">{selectedHospitalData?.city}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setStep('form')}>
              Voltar
            </Button>
            <Button fullWidth onClick={handleConfirm}>
              Confirmar
            </Button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <motion.div
          className="flex flex-col items-center text-center gap-4 py-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </motion.div>

          <div>
            <h3 className="text-xl font-bold text-dark">Doação agendada!</h3>
            <p className="text-sm text-gray-500 mt-2">
              Sua doação foi agendada com sucesso para{' '}
              <span className="font-semibold text-dark capitalize">{formatDisplayDate()}</span>{' '}
              às <span className="font-semibold text-dark">{selectedTime}</span>.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {selectedHospital} — {selectedHospitalData?.city}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full mt-2">
            <Button fullWidth onClick={resetAndClose}>
              Fechar
            </Button>
          </div>
        </motion.div>
      )}
    </Modal>
  );
}
