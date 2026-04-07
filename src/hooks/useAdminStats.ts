import { useMemo } from 'react'
import {
  mockAdminStats,
  mockDonationsByMonth,
  mockBloodTypeDistribution,
  mockUniversityStats,
  mockRecentDonations,
  mockBroadcastHistory,
} from '../mocks/admin'

export function useAdminStats() {
  const stats = useMemo(() => mockAdminStats, [])
  const donationsByMonth = useMemo(() => mockDonationsByMonth, [])
  const bloodTypeDistribution = useMemo(() => mockBloodTypeDistribution, [])
  const universityStats = useMemo(() => mockUniversityStats, [])
  const recentDonations = useMemo(() => mockRecentDonations, [])
  const broadcastHistory = useMemo(() => mockBroadcastHistory, [])

  return {
    stats,
    donationsByMonth,
    bloodTypeDistribution,
    universityStats,
    recentDonations,
    broadcastHistory,
  }
}
