import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: string
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'bg-red-100 text-red-600',
}: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-jakarta text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span
                className={`inline-flex items-center gap-0.5 text-sm font-semibold ${
                  trend.isPositive ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
