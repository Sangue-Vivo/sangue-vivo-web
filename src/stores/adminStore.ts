import { create } from 'zustand'
import type { User, Cause, Donation } from '../types'
import { BloodType, DonationStatus } from '../types'
import api from '../services/api'
import { mapUser, mapCause, mapDonation } from '../services/mappers'

interface AdminFilters {
  bloodType: BloodType | null
  university: string | null
  donationStatus: DonationStatus | null
}

interface AdminState {
  allUsers: User[]
  allCauses: Cause[]
  allDonations: Donation[]
  filters: AdminFilters
  loading: boolean

  loadAll: () => Promise<void>

  setFilters: (filters: Partial<AdminFilters>) => void
  resetFilters: () => void

  createCause: (cause: Omit<Cause, 'id' | 'createdAt' | 'updatedAt' | 'donations' | 'createdBy'>) => Promise<void>
  updateCauseActive: (causeId: string, active: boolean) => Promise<void>
  deleteCause: (causeId: string) => Promise<void>

  toggleUserActive: (userId: string) => void

  confirmDonation: (donationId: string) => Promise<void>
  cancelDonation: (donationId: string) => Promise<void>
}

const defaultFilters: AdminFilters = {
  bloodType: null,
  university: null,
  donationStatus: null,
}

async function fetchCauses(): Promise<Cause[]> {
  const res = await api.get('/causes', { params: { limit: 100 } })
  return (res.data.data.causes as unknown[]).map((c) => mapCause(c as never))
}

async function fetchDonations(): Promise<Donation[]> {
  const res = await api.get('/admin/donations')
  return (res.data.data.donations as unknown[]).map((d) => mapDonation(d as never))
}

export const useAdminStore = create<AdminState>()((set) => ({
  allUsers: [],
  allCauses: [],
  allDonations: [],
  filters: { ...defaultFilters },
  loading: false,

  loadAll: async () => {
    set({ loading: true })
    try {
      const [usersRes, causes, donations] = await Promise.all([
        api.get('/users/ranking', { params: { limit: 100 } }),
        fetchCauses(),
        fetchDonations(),
      ])
      set({
        allUsers: (usersRes.data.data.users as unknown[]).map((u) => mapUser(u as never)),
        allCauses: causes,
        allDonations: donations,
        loading: false,
      })
    } catch {
      set({ loading: false })
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }))
  },

  resetFilters: () => {
    set({ filters: { ...defaultFilters } })
  },

  createCause: async (causeData) => {
    await api.post('/causes', {
      title: causeData.title,
      description: causeData.description,
      bloodType: causeData.bloodTypesNeeded?.[0] ?? BloodType.O_NEGATIVE,
      hospital: causeData.hospital,
      city: causeData.city,
      urgencyLevel: causeData.urgencyLevel,
      goalDonations: causeData.goalDonations ?? 10,
      expiresAt:
        causeData.expiresAt instanceof Date
          ? causeData.expiresAt.toISOString()
          : new Date(causeData.expiresAt).toISOString(),
    })
    set({ allCauses: await fetchCauses() })
  },

  updateCauseActive: async (causeId, active) => {
    await api.patch(`/causes/${causeId}/status`, { status: active ? 'ACTIVE' : 'EXPIRED' })
    set({ allCauses: await fetchCauses() })
  },

  deleteCause: async (causeId) => {
    await api.delete(`/causes/${causeId}`)
    set({ allCauses: await fetchCauses() })
  },

  // A API não expõe alteração de elegibilidade pelo admin — atualização local apenas.
  toggleUserActive: (userId) => {
    set((state) => ({
      allUsers: state.allUsers.map((user) =>
        user.id === userId ? { ...user, isEligible: !user.isEligible, updatedAt: new Date() } : user
      ),
    }))
  },

  confirmDonation: async (donationId) => {
    await api.patch(`/donations/${donationId}/complete`)
    set({ allDonations: await fetchDonations() })
  },

  cancelDonation: async (donationId) => {
    await api.patch(`/donations/${donationId}/no-show`)
    set({ allDonations: await fetchDonations() })
  },
}))
