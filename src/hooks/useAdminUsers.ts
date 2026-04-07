import { useState, useMemo } from 'react'
import type { BloodType } from '../types'
import { useAdminStore } from '../stores/adminStore'

interface UserFilters {
  bloodType: BloodType | null
  university: string | null
}

const defaultFilters: UserFilters = {
  bloodType: null,
  university: null,
}

export function useAdminUsers() {
  const allUsers = useAdminStore((state) => state.allUsers)
  const toggleUserActive = useAdminStore((state) => state.toggleUserActive)

  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<UserFilters>({ ...defaultFilters })

  const filteredUsers = useMemo(() => {
    let users = allUsers

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.cpf.includes(term)
      )
    }

    if (filters.bloodType) {
      users = users.filter((user) => user.bloodType === filters.bloodType)
    }

    if (filters.university) {
      users = users.filter((user) =>
        user.university.toLowerCase().includes(filters.university!.toLowerCase())
      )
    }

    return users
  }, [allUsers, searchTerm, filters])

  const totalUsers = allUsers.length

  const resetFilters = () => {
    setFilters({ ...defaultFilters })
    setSearchTerm('')
  }

  return {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    totalUsers,
    resetFilters,
    toggleUserActive,
  }
}
