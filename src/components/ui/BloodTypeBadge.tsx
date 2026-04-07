import { BloodType } from '../../types';

interface BloodTypeBadgeProps {
  bloodType: BloodType;
  className?: string;
}

const bloodTypeDisplay: Record<BloodType, string> = {
  [BloodType.A_POSITIVE]: 'A+',
  [BloodType.A_NEGATIVE]: 'A-',
  [BloodType.B_POSITIVE]: 'B+',
  [BloodType.B_NEGATIVE]: 'B-',
  [BloodType.AB_POSITIVE]: 'AB+',
  [BloodType.AB_NEGATIVE]: 'AB-',
  [BloodType.O_POSITIVE]: 'O+',
  [BloodType.O_NEGATIVE]: 'O-',
};

const bloodTypeColors: Record<BloodType, string> = {
  [BloodType.A_POSITIVE]: 'bg-red-100 text-red-700 border-red-200',
  [BloodType.A_NEGATIVE]: 'bg-red-50 text-red-800 border-red-300',
  [BloodType.B_POSITIVE]: 'bg-blue-100 text-blue-700 border-blue-200',
  [BloodType.B_NEGATIVE]: 'bg-blue-50 text-blue-800 border-blue-300',
  [BloodType.AB_POSITIVE]: 'bg-purple-100 text-purple-700 border-purple-200',
  [BloodType.AB_NEGATIVE]: 'bg-purple-50 text-purple-800 border-purple-300',
  [BloodType.O_POSITIVE]: 'bg-orange-100 text-orange-700 border-orange-200',
  [BloodType.O_NEGATIVE]: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function BloodTypeBadge({
  bloodType,
  className = '',
}: BloodTypeBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-bold
        rounded-full border
        ${bloodTypeColors[bloodType]}
        ${className}
      `}
    >
      {bloodTypeDisplay[bloodType]}
    </span>
  );
}
