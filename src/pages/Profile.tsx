import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Droplets,
  Heart,
  ChevronRight,
  Calendar,
  GraduationCap,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import BloodTypeBadge from '../components/ui/BloodTypeBadge';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../hooks/useAuth';
import { useDonations } from '../hooks/useDonations';
import { formatDate, formatBloodType } from '../utils/formatters';
import { DonationStatus } from '../types';

export default function Profile() {
  const { user } = useAuth();
  const { donations, stats } = useDonations();

  if (!user) return null;

  // Generate chart data (donations per month, last 12 months)
  const chartData = useMemo(() => {
    const now = new Date();
    const months: { name: string; doacoes: number }[] = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
      const count = donations.filter((d) => {
        if (d.status !== DonationStatus.COMPLETED || !d.completedDate) return false;
        const cd = new Date(d.completedDate);
        return cd.getMonth() === date.getMonth() && cd.getFullYear() === date.getFullYear();
      }).length;
      months.push({ name: monthName, doacoes: count });
    }

    return months;
  }, [donations]);

  // Last 3 completed donations
  const recentDonations = donations
    .filter((d) => d.status === DonationStatus.COMPLETED)
    .sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime())
    .slice(0, 3);

  return (
    <PageContainer title="Meu Perfil">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="text-center">
            <div className="flex flex-col items-center gap-4">
              <Avatar name={user.name} bloodType={user.bloodType} size="xl" />
              <div>
                <h2 className="text-xl font-bold text-dark">{user.name}</h2>
                <div className="flex items-center justify-center gap-3 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>{user.university}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-1">{user.course}</p>
                <div className="mt-3">
                  <BloodTypeBadge bloodType={user.bloodType} className="text-sm px-3 py-1" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { icon: Droplets, label: 'Doações', value: stats.totalCompleted, color: 'text-primary', bg: 'bg-primary-light' },
            { icon: Heart, label: 'Vidas que poderão ser salvas', value: stats.potentialLivesSaved, color: 'text-coral', bg: 'bg-orange-50' },
            { icon: Droplets, label: 'Tipo sanguíneo', value: user.bloodType ? formatBloodType(user.bloodType) : 'Não informado', color: 'text-primary', bg: 'bg-primary-light' },
            { icon: GraduationCap, label: 'Universidade', value: user.university?.split(' — ')[0] ?? user.university, color: 'text-info', bg: 'bg-blue-50' },
          ].map((stat) => (
            <Card key={stat.label} className="text-center p-4">
              <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-lg font-bold text-dark">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Donations Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h3 className="text-lg font-bold text-dark mb-4">Doações por mês</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    }}
                    formatter={(value) => [`${value} doação(ões)`, 'Doações']}
                  />
                  <Bar
                    dataKey="doacoes"
                    fill="#DC2626"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Recent Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-dark">Histórico recente</h3>
            <Link
              to="/donations"
              className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline"
            >
              Ver histórico completo <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentDonations.map((donation) => (
              <Card key={donation.id} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <Droplets className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-dark truncate">{donation.hospital}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {formatDate(donation.completedDate!)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}
