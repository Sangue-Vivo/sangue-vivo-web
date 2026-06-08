import { useMemo, useCallback, useState, useEffect } from 'react'
import { BloodType, type Cause } from '../types'
import api from '../services/api'
import { mapCause } from '../services/mappers'
import { useAuth } from './useAuth'

const bloodTypeCompatibility: Record<BloodType, BloodType[]> = {
  [BloodType.O_NEGATIVE]: [
    BloodType.O_NEGATIVE,
    BloodType.O_POSITIVE,
    BloodType.A_NEGATIVE,
    BloodType.A_POSITIVE,
    BloodType.B_NEGATIVE,
    BloodType.B_POSITIVE,
    BloodType.AB_NEGATIVE,
    BloodType.AB_POSITIVE,
  ],
  [BloodType.O_POSITIVE]: [
    BloodType.O_POSITIVE,
    BloodType.A_POSITIVE,
    BloodType.B_POSITIVE,
    BloodType.AB_POSITIVE,
  ],
  [BloodType.A_NEGATIVE]: [
    BloodType.A_NEGATIVE,
    BloodType.A_POSITIVE,
    BloodType.AB_NEGATIVE,
    BloodType.AB_POSITIVE,
  ],
  [BloodType.A_POSITIVE]: [BloodType.A_POSITIVE, BloodType.AB_POSITIVE],
  [BloodType.B_NEGATIVE]: [
    BloodType.B_NEGATIVE,
    BloodType.B_POSITIVE,
    BloodType.AB_NEGATIVE,
    BloodType.AB_POSITIVE,
  ],
  [BloodType.B_POSITIVE]: [BloodType.B_POSITIVE, BloodType.AB_POSITIVE],
  [BloodType.AB_NEGATIVE]: [BloodType.AB_NEGATIVE, BloodType.AB_POSITIVE],
  [BloodType.AB_POSITIVE]: [BloodType.AB_POSITIVE],
}

export function useCauses() {
  const { user } = useAuth()
  const [causes, setCauses] = useState<Cause[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCauses = useCallback(async () => {
    try {
      const res = await api.get('/causes', { params: { limit: 100 } })
      setCauses((res.data.data.causes as unknown[]).map((c) => mapCause(c as never)))
    } catch {
      setCauses([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCauses()
  }, [fetchCauses])

  const activeCauses = useMemo(() => causes.filter((c) => c.active), [causes])

  const compatibleCauses = useMemo(() => {
    if (!user) return activeCauses

    const canDonateTo = bloodTypeCompatibility[user.bloodType] || []
    return activeCauses.filter((cause) =>
      cause.bloodTypesNeeded.some((bt) => canDonateTo.includes(bt))
    )
  }, [user, activeCauses])

  const getCauseById = useCallback(async (id: string): Promise<Cause | null> => {
    try {
      const res = await api.get(`/causes/${id}`)
      return mapCause(res.data.data.cause)
    } catch {
      return null
    }
  }, [])

  return {
    causes: activeCauses,
    compatibleCauses,
    loading,
    getCauseById,
    refetch: fetchCauses,
  }
}
