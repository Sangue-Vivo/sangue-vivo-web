import { useState, useMemo, useCallback } from 'react'
import { DonationStatus } from '../types'
import type { Donation } from '../types'
import { mockDonations } from '../mocks/donations'
import { mockCurrentUser } from '../mocks/users'

export function useDonations() {
  const [donations, setDonations] = useState<Donation[]>(mockDonations)

  const stats = useMemo(() => {
    const completed = donations.filter(
      (d) => d.status === DonationStatus.COMPLETED,
    )
    const scheduled = donations.filter(
      (d) => d.status === DonationStatus.SCHEDULED,
    )
    const linkedToCause = completed.filter((d) => d.causeDonation !== null)

    return {
      totalCompleted: completed.length,
      totalScheduled: scheduled.length,
      donationsForCauses: linkedToCause.length,
      // Estimate: each donation can potentially save up to 4 lives
      potentialLivesSaved: completed.length * 4,
    }
  }, [donations])

  const scheduleDonation = useCallback(
    (data: { scheduledDate: Date; hospital: string; city: string; causeId?: string }) => {
      const newDonation: Donation = {
        id: `donation-${Date.now()}`,
        userId: mockCurrentUser.id,
        user: mockCurrentUser,
        scheduledDate: data.scheduledDate,
        completedDate: null,
        status: DonationStatus.SCHEDULED,
        hospital: data.hospital,
        city: data.city,
        causeDonation: data.causeId
          ? {
              id: `cd-${Date.now()}`,
              causeId: data.causeId,
              cause: null as unknown as import('../types').Cause,
              donationId: `donation-${Date.now()}`,
              donation: null as unknown as Donation,
              createdAt: new Date(),
            }
          : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setDonations((prev) => [...prev, newDonation])
      return newDonation
    },
    [],
  )

  const cancelDonation = useCallback((donationId: string) => {
    setDonations((prev) =>
      prev.map((d) =>
        d.id === donationId
          ? { ...d, status: DonationStatus.CANCELLED, updatedAt: new Date() }
          : d,
      ),
    )
  }, [])

  return {
    donations,
    stats,
    scheduleDonation,
    cancelDonation,
  }
}
