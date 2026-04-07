import { useState, useMemo, useCallback } from 'react'
import type { Cause } from '../types'
import { useAdminStore } from '../stores/adminStore'

interface CauseFilters {
  active: boolean | null
  urgencyLevel: number | null
}

const defaultFilters: CauseFilters = {
  active: null,
  urgencyLevel: null,
}

export function useAdminCauses() {
  const allCauses = useAdminStore((state) => state.allCauses)
  const storeCreateCause = useAdminStore((state) => state.createCause)
  const storeUpdateCauseActive = useAdminStore((state) => state.updateCauseActive)
  const storeDeleteCause = useAdminStore((state) => state.deleteCause)

  const [filters, setFilters] = useState<CauseFilters>({ ...defaultFilters })

  const filteredCauses = useMemo(() => {
    let causes = allCauses

    if (filters.active !== null) {
      causes = causes.filter((cause) => cause.active === filters.active)
    }

    if (filters.urgencyLevel !== null) {
      causes = causes.filter((cause) => cause.urgencyLevel >= filters.urgencyLevel!)
    }

    return causes
  }, [allCauses, filters])

  const createCause = useCallback(
    (causeData: Omit<Cause, 'id' | 'createdAt' | 'updatedAt' | 'donations' | 'createdBy'>) => {
      storeCreateCause(causeData)
    },
    [storeCreateCause]
  )

  const updateCauseActive = useCallback(
    (causeId: string, active: boolean) => {
      storeUpdateCauseActive(causeId, active)
    },
    [storeUpdateCauseActive]
  )

  const deleteCause = useCallback(
    (causeId: string) => {
      storeDeleteCause(causeId)
    },
    [storeDeleteCause]
  )

  const resetFilters = () => {
    setFilters({ ...defaultFilters })
  }

  return {
    causes: allCauses,
    filteredCauses,
    filters,
    setFilters,
    resetFilters,
    createCause,
    updateCauseActive,
    deleteCause,
  }
}
