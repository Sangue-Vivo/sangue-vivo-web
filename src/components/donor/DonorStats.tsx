import { motion } from 'framer-motion';
import { Droplets, Heart, Activity } from 'lucide-react';
import { BloodType } from '../../types';

interface DonorStatsProps {
  totalDonations: number;
  potentialLivesSaved: number;
  bloodType: BloodType;
  isEligible: boolean;
  daysUntilEligible?: number;
}

const bloodTypeLabels: Record<BloodType, string> = {
  [BloodType.A_POSITIVE]: 'A+',
  [BloodType.A_NEGATIVE]: 'A-',
  [BloodType.B_POSITIVE]: 'B+',
  [BloodType.B_NEGATIVE]: 'B-',
  [BloodType.AB_POSITIVE]: 'AB+',
  [BloodType.AB_NEGATIVE]: 'AB-',
  [BloodType.O_POSITIVE]: 'O+',
  [BloodType.O_NEGATIVE]: 'O-',
};

interface StatItem {
  icon: React.ElementType;
  value: number | string;
  label: string;
  color: string;
  bgColor: string;
}

export default function DonorStats({
  totalDonations,
  potentialLivesSaved,
  bloodType,
  isEligible,
  daysUntilEligible,
}: DonorStatsProps) {
  const statusValue = isEligible
    ? 'Apto a doar'
    : `${daysUntilEligible ?? '?'} dias restantes`;

  const stats: StatItem[] = [
    {
      icon: Droplets,
      value: totalDonations,
      label: 'Doações',
      color: 'text-primary',
      bgColor: 'bg-primary-light',
    },
    {
      icon: Heart,
      value: potentialLivesSaved,
      label: 'Vidas que poderão ser salvas',
      color: 'text-coral',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Droplets,
      value: bloodTypeLabels[bloodType],
      label: 'Tipo sanguíneo',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Activity,
      value: statusValue,
      label: 'Status',
      color: isEligible ? 'text-success' : 'text-warning',
      bgColor: isEligible ? 'bg-green-50' : 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col items-center text-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}
          >
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div>
            <motion.p
              className="text-2xl font-bold text-dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
            >
              {stat.value}
            </motion.p>
            <p className="text-xs text-gray-400 font-medium mt-1">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
