// Monthly donations data for chart (last 12 months)
export const mockDonationsByMonth = [
  { month: 'Abr/25', doacoes: 45 },
  { month: 'Mai/25', doacoes: 52 },
  { month: 'Jun/25', doacoes: 38 },
  { month: 'Jul/25', doacoes: 61 },
  { month: 'Ago/25', doacoes: 55 },
  { month: 'Set/25', doacoes: 48 },
  { month: 'Out/25', doacoes: 67 },
  { month: 'Nov/25', doacoes: 72 },
  { month: 'Dez/25', doacoes: 41 },
  { month: 'Jan/26', doacoes: 58 },
  { month: 'Fev/26', doacoes: 63 },
  { month: 'Mar/26', doacoes: 49 },
]

// Blood type distribution among donors
export const mockBloodTypeDistribution: {
  type: string
  count: number
  percentage: number
  color: string
}[] = [
  { type: 'O+', count: 142, percentage: 36, color: '#DC2626' },
  { type: 'A+', count: 98, percentage: 25, color: '#F97066' },
  { type: 'B+', count: 47, percentage: 12, color: '#F59E0B' },
  { type: 'O-', count: 35, percentage: 9, color: '#991B1B' },
  { type: 'A-', count: 28, percentage: 7, color: '#FDA4AF' },
  { type: 'AB+', count: 23, percentage: 6, color: '#06B6D4' },
  { type: 'B-', count: 12, percentage: 3, color: '#8B5CF6' },
  { type: 'AB-', count: 8, percentage: 2, color: '#9CA3AF' },
]

// University stats
export const mockUniversityStats = [
  { name: 'UFAL', donors: 134, donations: 312 },
  { name: 'CESMAC', donors: 89, donations: 198 },
  { name: 'UNIT', donors: 67, donations: 145 },
  { name: 'FITS', donors: 45, donations: 89 },
  { name: 'UNINASSAU', donors: 34, donations: 67 },
  { name: 'UNEAL', donors: 12, donations: 23 },
  { name: 'IFAL', donors: 8, donations: 15 },
  { name: 'Estacio', donors: 4, donations: 7 },
]

// Admin KPI stats
export const mockAdminStats = {
  totalDonors: 393,
  totalDonations: 649,
  donationsThisMonth: 49,
  potentialLivesSaved: 2596,
  activeCauses: 5,
  returnRate: 72,
  avgDonationsPerDonor: 1.65,
  eligibleDonors: 187,
}

// Recent donations for admin table (more detailed, with user names)
export const mockRecentDonations: {
  id: string
  donorName: string
  bloodType: string
  hospital: string
  date: string
  status: 'COMPLETED' | 'SCHEDULED' | 'CANCELLED' | 'NO_SHOW'
}[] = [
  { id: 'rd1', donorName: 'Maria Santos', bloodType: 'O+', hospital: 'HEMO Maceio', date: '2026-03-24', status: 'COMPLETED' },
  { id: 'rd2', donorName: 'Joao Pedro', bloodType: 'A+', hospital: 'HEMO Maceio', date: '2026-03-24', status: 'COMPLETED' },
  { id: 'rd3', donorName: 'Ana Beatriz', bloodType: 'B+', hospital: 'HEMO Arapiraca', date: '2026-03-25', status: 'SCHEDULED' },
  { id: 'rd4', donorName: 'Carlos Lima', bloodType: 'O-', hospital: 'HEMO Maceio', date: '2026-03-25', status: 'SCHEDULED' },
  { id: 'rd5', donorName: 'Fernanda Costa', bloodType: 'AB+', hospital: 'HEMO Maceio', date: '2026-03-23', status: 'COMPLETED' },
  { id: 'rd6', donorName: 'Lucas Mendes', bloodType: 'A-', hospital: 'HEMO Maceio', date: '2026-03-22', status: 'CANCELLED' },
  { id: 'rd7', donorName: 'Juliana Alves', bloodType: 'O+', hospital: 'HEMO Arapiraca', date: '2026-03-22', status: 'COMPLETED' },
  { id: 'rd8', donorName: 'Pedro Henrique', bloodType: 'B-', hospital: 'HEMO Maceio', date: '2026-03-21', status: 'NO_SHOW' },
]

// Broadcast notification history
export const mockBroadcastHistory = [
  { id: 'b1', title: 'Estoque critico de O-', target: 'Doadores O-', sentAt: '2026-03-20', recipients: 35 },
  { id: 'b2', title: 'Campanha de Pascoa', target: 'Todos', sentAt: '2026-03-15', recipients: 393 },
  { id: 'b3', title: 'Novo hemocentro parceiro', target: 'Todos', sentAt: '2026-03-01', recipients: 380 },
  { id: 'b4', title: 'Doacao urgente — Cirurgia', target: 'Doadores O+, O-', sentAt: '2026-02-28', recipients: 177 },
]
