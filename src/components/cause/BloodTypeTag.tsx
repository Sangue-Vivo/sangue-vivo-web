import { BloodType } from '../../types';

interface BloodTypeTagProps {
  bloodType: BloodType;
  isMatch?: boolean;
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

export default function BloodTypeTag({
  bloodType,
  isMatch = false,
  className = '',
}: BloodTypeTagProps) {
  return (
    <span
      className={`
        inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-md
        transition-colors
        ${
          isMatch
            ? 'bg-primary text-white ring-2 ring-primary/30'
            : 'bg-gray-100 text-gray-700'
        }
        ${className}
      `}
    >
      {bloodTypeDisplay[bloodType]}
    </span>
  );
}
