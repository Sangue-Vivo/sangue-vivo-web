import Avatar from '../ui/Avatar';
import { BloodType } from '../../types';
import { Heart, Droplets } from 'lucide-react';

interface DonorCardProps {
  name: string;
  university: string;
  bloodType: BloodType;
  totalDonations: number;
  isCurrentUser?: boolean;
  className?: string;
}

export default function DonorCard({
  name,
  university,
  bloodType,
  totalDonations,
  isCurrentUser = false,
  className = '',
}: DonorCardProps) {
  const potentialLivesSaved = totalDonations * 3;

  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-2xl border transition-colors
        ${isCurrentUser ? 'bg-primary-light border-primary/30' : 'bg-white border-gray-200'}
        ${className}
      `}
    >
      <Avatar name={name} bloodType={bloodType} size="md" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-dark truncate">{name}</p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{university}</p>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <Droplets className="w-4 h-4 text-primary" />
          <span className="font-semibold">{totalDonations}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <Heart className="w-4 h-4 text-coral" />
          <span className="font-semibold">{potentialLivesSaved}</span>
        </div>
      </div>
    </div>
  );
}
