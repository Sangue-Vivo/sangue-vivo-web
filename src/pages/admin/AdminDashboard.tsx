import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,

  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import {
  Users,
  Droplets,
  HeartPulse,
  Megaphone,
  RefreshCcw,
  UserCheck,
  AlertTriangle,
} from 'lucide-react'
import StatCard from '../../components/admin/StatCard'
import { useAdminStats } from '../../hooks/useAdminStats'
import { useAdminCauses } from '../../hooks/useAdminCauses'
import Badge from '../../components/ui/Badge'

import { formatDate, formatNumber } from '../../utils/formatters'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' },
  }),
}

const STATUS_BADGE: Record<string, { variant: 'success' | 'info' | 'danger' | 'default'; label: string }> = {
  COMPLETED: { variant: 'success', label: 'Concluida' },
  SCHEDULED: { variant: 'info', label: 'Agendada' },
  CANCELLED: { variant: 'danger', label: 'Cancelada' },
  NO_SHOW: { variant: 'default', label: 'No-show' },
}

export default function AdminDashboard() {
  const {
    stats,
    donationsByMonth,
    bloodTypeDistribution,
    universityStats,
    recentDonations,
  } = useAdminStats()
  const { causes } = useAdminCauses()

  const urgentCauses = useMemo(
    () => causes.filter((c) => c.urgencyLevel >= 4 && c.active),
    [causes]
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jakarta text-2xl font-bold text-gray-900">Painel Administrativo</h1>
        <p className="mt-1 text-sm text-gray-500">Visao geral da plataforma Sangue Vivo</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          {
            title: 'Total Doadores',
            value: formatNumber(stats.totalDonors),
            icon: <Users className="h-6 w-6" />,
            color: 'bg-red-100 text-red-600',
            trend: { value: 12, isPositive: true },
            subtitle: 'vs. mes anterior',
          },
          {
            title: 'Doacoes Este Mes',
            value: stats.donationsThisMonth,
            icon: <Droplets className="h-6 w-6" />,
            color: 'bg-blue-100 text-blue-600',
            trend: { value: 8, isPositive: false },
            subtitle: 'vs. mes anterior',
          },
          {
            title: 'Vidas Salvas',
            value: formatNumber(stats.potentialLivesSaved),
            icon: <HeartPulse className="h-6 w-6" />,
            color: 'bg-green-100 text-green-600',
            subtitle: 'estimativa total',
          },
          {
            title: 'Causas Ativas',
            value: stats.activeCauses,
            icon: <Megaphone className="h-6 w-6" />,
            color: 'bg-purple-100 text-purple-600',
          },
          {
            title: 'Taxa de Retorno',
            value: `${stats.returnRate}%`,
            icon: <RefreshCcw className="h-6 w-6" />,
            color: 'bg-amber-100 text-amber-600',
            trend: { value: 5, isPositive: true },
          },
          {
            title: 'Doadores Elegiveis',
            value: stats.eligibleDonors,
            icon: <UserCheck className="h-6 w-6" />,
            color: 'bg-cyan-100 text-cyan-600',
            subtitle: 'prontos para doar',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          className="rounded-2xl bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h3 className="mb-4 font-jakarta text-lg font-bold text-gray-900">
            Doacoes por Mes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={donationsByMonth}>
              <defs>
                <linearGradient id="colorDoacoes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="doacoes"
                stroke="#DC2626"
                strokeWidth={2.5}
                fill="url(#colorDoacoes)"
                name="Doacoes"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="rounded-2xl bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <h3 className="mb-4 font-jakarta text-lg font-bold text-gray-900">
            Distribuicao por Tipo Sanguineo
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bloodTypeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="count"
                nameKey="type"
                paddingAngle={2}
                label={({ type, percentage }: { type: string; percentage: number }) => `${type} (${percentage}%)`}
              >
                {bloodTypeDistribution.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          className="rounded-2xl bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <h3 className="mb-4 font-jakarta text-lg font-bold text-gray-900">
            Top Universidades
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Universidade
                  </th>
                  <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Doadores
                  </th>
                  <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Doacoes
                  </th>
                </tr>
              </thead>
              <tbody>
                {universityStats.map((uni, i) => (
                  <tr key={uni.name} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                          {i + 1}
                        </span>
                        {uni.name}
                      </div>
                    </td>
                    <td className="py-3 text-center text-gray-600">{uni.donors}</td>
                    <td className="py-3 text-center text-gray-600">{uni.donations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          className="rounded-2xl bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-jakarta text-lg font-bold text-gray-900">Causas Urgentes</h3>
          </div>
          {urgentCauses.length === 0 ? (
            <p className="py-8 text-center text-gray-400">Nenhuma causa urgente no momento.</p>
          ) : (
            <div className="space-y-4">
              {urgentCauses.map((cause) => {
                const stockColors: Record<string, string> = {
                  critical: 'bg-red-100 text-red-700',
                  low: 'bg-amber-100 text-amber-700',
                  moderate: 'bg-yellow-100 text-yellow-700',
                  stable: 'bg-green-100 text-green-700',
                }
                const stockLabels: Record<string, string> = {
                  critical: 'Critico',
                  low: 'Baixo',
                  moderate: 'Moderado',
                  stable: 'Estavel',
                }
                return (
                  <div
                    key={cause.id}
                    className="rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">{cause.title}</h4>
                        <p className="mt-0.5 text-xs text-gray-500">{cause.hospital}</p>
                      </div>
                      <Badge
                        variant={cause.urgencyLevel === 5 ? 'danger' : 'warning'}
                        size="sm"
                      >
                        Urgencia {cause.urgencyLevel}
                      </Badge>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${stockColors[cause.stockLevel]}`}>
                      Estoque: {stockLabels[cause.stockLevel]}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        <motion.div
          className="rounded-2xl bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          <h3 className="mb-4 font-jakarta text-lg font-bold text-gray-900">Ultimas Doacoes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Doador
                  </th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Tipo
                  </th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Hemocentro
                  </th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Data
                  </th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentDonations.map((d) => {
                  const badge = STATUS_BADGE[d.status] || STATUS_BADGE.SCHEDULED
                  return (
                    <tr key={d.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 font-medium text-gray-700">{d.donorName}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">
                          {d.bloodType}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{d.hospital}</td>
                      <td className="py-3 text-gray-600">{formatDate(d.date)}</td>
                      <td className="py-3">
                        <Badge variant={badge.variant} size="sm">
                          {badge.label}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
