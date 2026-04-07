import { BloodType } from '../../types';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string;
  bloodType?: BloodType;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
};

const bloodTypeColors: Record<BloodType, string> = {
  [BloodType.A_POSITIVE]: 'bg-red-500',
  [BloodType.A_NEGATIVE]: 'bg-red-700',
  [BloodType.B_POSITIVE]: 'bg-blue-500',
  [BloodType.B_NEGATIVE]: 'bg-blue-700',
  [BloodType.AB_POSITIVE]: 'bg-purple-500',
  [BloodType.AB_NEGATIVE]: 'bg-purple-700',
  [BloodType.O_POSITIVE]: 'bg-coral',
  [BloodType.O_NEGATIVE]: 'bg-amber-600',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]![0] : '';
  return (first + last).toUpperCase();
}

export default function Avatar({
  name,
  bloodType,
  size = 'md',
  className = '',
}: AvatarProps) {
  const bgColor = bloodType ? bloodTypeColors[bloodType] : 'bg-primary';

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full font-bold text-white select-none shrink-0
        ${bgColor}
        ${sizeClasses[size]}
        ${className}
      `}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
