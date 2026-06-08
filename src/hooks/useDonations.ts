import { useState, useMemo, useCallback, useEffect } from 'react'
import { DonationStatus } from '../types'
import type { Donation } from '../types'
import api from '../services/api'
import { mapDonation } from '../services/mappers'

export function useDonations() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDonations = useCallback(async () => {
    try {
      const res = await api.get('/donations', { params: { limit: 100 } })
      setDonations((res.data.data.donations as unknown[]).map((d) => mapDonation(d as never)))
    } catch {
      setDonations([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDonations()
  }, [fetchDonations])

  const stats = useMemo(() => {
    const completed = donations.filter((d) => d.status === DonationStatus.COMPLETED)
    const scheduled = donations.filter((d) => d.status === DonationStatus.SCHEDULED)
    const linkedToCause = completed.filter((d) => d.causeDonation !== null)

    return {
      totalCompleted: completed.length,
      totalScheduled: scheduled.length,
      donationsForCauses: linkedToCause.length,
      potentialLivesSaved: completed.length * 4,
    }
  }, [donations])

  const scheduleDonation = useCallback(
    async (data: { scheduledDate: Date; hospital: string; city: string; causeId?: string }) => {
      const res = await api.post('/donations', {
        scheduledDate: data.scheduledDate.toISOString(),
        hospital: data.hospital,
        city: data.city,
        causeId: data.causeId,
      })
      await fetchDonations()
      return mapDonation(res.data.data.donation)
    },
    [fetchDonations]
  )

  const cancelDonation = useCallback(
    async (donationId: string) => {
      await api.patch(`/donations/${donationId}/cancel`)
      await fetchDonations()
    },
    [fetchDonations]
  )

  return {
    donations,
    stats,
    loading,
    scheduleDonation,
    cancelDonation,
    refetch: fetchDonations,
  }
}
