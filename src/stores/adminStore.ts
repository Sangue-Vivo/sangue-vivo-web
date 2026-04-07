import { create } from 'zustand'
import type { User, Cause, Donation } from '../types'
import { BloodType, DonationStatus } from '../types'
import { mockCurrentUser, mockTopDonors } from '../mocks/users'
import { mockCauses } from '../mocks/causes'
import { mockDonations } from '../mocks/donations'

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

  // Filter actions
  setFilters: (filters: Partial<AdminFilters>) => void
  resetFilters: () => void

  // Cause CRUD
  createCause: (cause: Omit<Cause, 'id' | 'createdAt' | 'updatedAt' | 'donations' | 'createdBy'>) => void
  updateCauseActive: (causeId: string, active: boolean) => void
  deleteCause: (causeId: string) => void

  // User management
  toggleUserActive: (userId: string) => void

  // Donation management
  confirmDonation: (donationId: string) => void
  cancelDonation: (donationId: string) => void
}

const defaultFilters: AdminFilters = {
  bloodType: null,
  university: null,
  donationStatus: null,
}

export const useAdminStore = create<AdminState>()((set) => ({
  allUsers: [mockCurrentUser, ...mockTopDonors],
  allCauses: [...mockCauses],
  allDonations: [...mockDonations],
  filters: { ...defaultFilters },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }))
  },

  resetFilters: () => {
    set({ filters: { ...defaultFilters } })
  },

  createCause: (causeData) => {
    const newCause: Cause = {
      ...causeData,
      id: `cause-${Date.now()}`,
      donations: [],
      createdBy: mockCurrentUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    set((state) => ({
      allCauses: [newCause, ...state.allCauses],
    }))
  },

  updateCauseActive: (causeId, active) => {
    set((state) => ({
      allCauses: state.allCauses.map((cause) =>
        cause.id === causeId
          ? { ...cause, active, updatedAt: new Date() }
          : cause
      ),
    }))
  },

  deleteCause: (causeId) => {
    set((state) => ({
      allCauses: state.allCauses.filter((cause) => cause.id !== causeId),
    }))
  },

  toggleUserActive: (userId) => {
    set((state) => ({
      allUsers: state.allUsers.map((user) =>
        user.id === userId
          ? { ...user, isEligible: !user.isEligible, updatedAt: new Date() }
          : user
      ),
    }))
  },

  confirmDonation: (donationId) => {
    set((state) => ({
      allDonations: state.allDonations.map((donation) =>
        donation.id === donationId
          ? {
              ...donation,
              status: DonationStatus.COMPLETED,
              completedDate: new Date(),
              updatedAt: new Date(),
            }
          : donation
      ),
    }))
  },

  cancelDonation: (donationId) => {
    set((state) => ({
      allDonations: state.allDonations.map((donation) =>
        donation.id === donationId
          ? {
              ...donation,
              status: DonationStatus.CANCELLED,
              updatedAt: new Date(),
            }
          : donation
      ),
    }))
  },
}))
