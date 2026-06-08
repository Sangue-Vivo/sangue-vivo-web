import { useState, useEffect } from 'react'
import { BloodType } from '../types'
import api from '../services/api'
import { BLOOD_TYPE_LABELS } from '../utils/bloodTypes'

interface AdminKpis {
  totalDonors: number
  totalDonations: number
  donationsThisMonth: number
  potentialLivesSaved: number
  activeCauses: number
  returnRate: number
  eligibleDonors: number
}

interface MonthPoint {
  month: string
  doacoes: number
}

interface BloodPoint {
  type: string
  count: number
  percentage: number
  color: string
}

interface UniPoint {
  name: string
  donors: number
  donations: number
}

interface RecentDonation {
  id: string
  donorName: string
  bloodType: string
  hospital: string
  date: string
  status: string
}

const emptyStats: AdminKpis = {
  totalDonors: 0,
  totalDonations: 0,
  donationsThisMonth: 0,
  potentialLivesSaved: 0,
  activeCauses: 0,
  returnRate: 0,
  eligibleDonors: 0,
}

const BLOOD_COLORS: Record<string, string> = {
  O_POSITIVE: '#DC2626',
  A_POSITIVE: '#F97066',
  B_POSITIVE: '#F59E0B',
  O_NEGATIVE: '#991B1B',
  A_NEGATIVE: '#FDA4AF',
  AB_POSITIVE: '#06B6D4',
  B_NEGATIVE: '#8B5CF6',
  AB_NEGATIVE: '#9CA3AF',
}

const MONTH_ABBR = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function formatMonth(ym: string): string {
  const [year, month] = ym.split('-')
  const idx = parseInt(month, 10) - 1
  return `${MONTH_ABBR[idx] ?? month}/${year.slice(2)}`
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminKpis>(emptyStats)
  const [donationsByMonth, setDonationsByMonth] = useState<MonthPoint[]>([])
  const [bloodTypeDistribution, setBloodTypeDistribution] = useState<BloodPoint[]>([])
  const [universityStats, setUniversityStats] = useState<UniPoint[]>([])
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [kpis, byMonth, blood, unis, donations] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/stats/donations-by-month'),
          api.get('/admin/stats/blood-distribution'),
          api.get('/admin/stats/university-stats'),
          api.get('/admin/donations'),
        ])
        if (!active) return

        const k = kpis.data.data
        const eligibleDonors = (donations.data.data.donations as { user?: { isEligible?: boolean } }[])
          .filter((d) => d.user?.isEligible).length
        setStats({
          totalDonors: k.totalUsers ?? 0,
          totalDonations: k.totalDonations ?? 0,
          donationsThisMonth: k.donationsThisMonth ?? 0,
          potentialLivesSaved: (k.totalDonations ?? 0) * 4,
          activeCauses: k.activeCauses ?? 0,
          returnRate: 0,
          eligibleDonors,
        })

        setDonationsByMonth(
          (byMonth.data.data as { month: string; count: number }[]).map((m) => ({
            month: formatMonth(m.month),
            doacoes: Number(m.count),
          }))
        )

        const bloodRaw = blood.data.data as { bloodType: string; count: number }[]
        const bloodTotal = bloodRaw.reduce((sum, b) => sum + Number(b.count), 0) || 1
        setBloodTypeDistribution(
          bloodRaw.map((b) => ({
            type: BLOOD_TYPE_LABELS[b.bloodType as BloodType] ?? b.bloodType,
            count: Number(b.count),
            percentage: Math.round((Number(b.count) / bloodTotal) * 100),
            color: BLOOD_COLORS[b.bloodType] ?? '#9CA3AF',
          }))
        )

        setUniversityStats(
          (unis.data.data as { university: string; donors: number; totalDonations: number }[]).map((u) => ({
            name: u.university || '—',
            donors: Number(u.donors),
            donations: Number(u.totalDonations),
          }))
        )

        setRecentDonations(
          (donations.data.data.donations as Record<string, unknown>[]).slice(0, 8).map((d) => ({
            id: String(d.id),
            donorName: (d.user as { name?: string } | undefined)?.name ?? '—',
            bloodType: BLOOD_TYPE_LABELS[(d.user as { bloodType?: BloodType } | undefined)?.bloodType as BloodType] ?? '—',
            hospital: String(d.hospital ?? ''),
            date: String(d.scheduledDate ?? d.createdAt ?? ''),
            status: String(d.status ?? 'SCHEDULED'),
          }))
        )
      } catch {
        if (active) setStats(emptyStats)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return {
    stats,
    donationsByMonth,
    bloodTypeDistribution,
    universityStats,
    recentDonations,
    broadcastHistory: [] as { id: string; title: string; target: string; sentAt: string; recipients: number }[],
    loading,
  }
}
