import { MapPin } from 'lucide-react';
import BloodTypeBadge from '../ui/BloodTypeBadge';
import Button from '../ui/Button';
import type { Cause } from '../../types';

interface CauseCardProps {
  cause: Cause;
  onHelp?: (causeId: string) => void;
  className?: string;
}

type StockLevel = Cause['stockLevel'];

const stockLevelBorderColors: Record<StockLevel, string> = {
  critical: 'border-l-[#DC2626]',
  low: 'border-l-[#F59E0B]',
  moderate: 'border-l-[#FBBF24]',
  stable: 'border-l-[#16A34A]',
};

const stockLevelBadgeConfig: Record<StockLevel, { label: string; bg: string; text: string }> = {
  critical: { label: 'Estoque Crítico', bg: 'bg-red-100', text: 'text-red-700' },
  low: { label: 'Estoque Baixo', bg: 'bg-amber-100', text: 'text-amber-700' },
  moderate: { label: 'Estoque Moderado', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  stable: { label: 'Estoque Estável', bg: 'bg-green-100', text: 'text-green-700' },
};

export default function CauseCard({
  cause,
  onHelp,
  className = '',
}: CauseCardProps) {
  const stockLevel = cause.stockLevel ?? 'moderate';
  const borderColor = stockLevelBorderColors[stockLevel];
  const badgeConfig = stockLevelBadgeConfig[stockLevel];
  const isUrgent = stockLevel === 'critical' || stockLevel === 'low';

  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden
        border-l-4 ${borderColor}
        ${className}
      `}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-dark truncate">{cause.title}</h3>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
              {cause.description}
            </p>
          </div>
          <span
            className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${badgeConfig.bg} ${badgeConfig.text}`}
          >
            {badgeConfig.label}
          </span>
        </div>

        {cause.bloodTypesNeeded && cause.bloodTypesNeeded.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {cause.bloodTypesNeeded.map((bt) => (
              <BloodTypeBadge key={bt} bloodType={bt} />
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
          <MapPin className="w-3.5 h-3.5" />
          <span>
            {cause.hospital} &middot; {cause.city}
          </span>
        </div>

        <div className="mt-4">
          <Button
            variant={isUrgent ? 'primary' : 'outline'}
            size="sm"
            fullWidth
            onClick={() => onHelp?.(cause.id)}
          >
            {isUrgent ? 'Quero ajudar' : 'Ver detalhes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
