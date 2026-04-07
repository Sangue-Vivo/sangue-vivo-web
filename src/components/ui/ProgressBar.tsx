import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  gradient?: boolean;
  labelLeft?: string;
  labelRight?: string;
  height?: string;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  gradient = false,
  labelLeft,
  labelRight,
  height = 'h-3',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`w-full ${className}`}>
      {(labelLeft || labelRight) && (
        <div className="flex justify-between items-center mb-1.5">
          {labelLeft && (
            <span className="text-sm font-medium text-gray-700">{labelLeft}</span>
          )}
          {labelRight && (
            <span className="text-sm text-gray-400">{labelRight}</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}>
        <motion.div
          className={`h-full rounded-full ${
            gradient
              ? 'bg-gradient-to-r from-primary via-coral to-rose'
              : 'bg-primary'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
