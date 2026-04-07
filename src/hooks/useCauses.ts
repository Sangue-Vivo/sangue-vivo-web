import { useMemo, useCallback } from 'react'
import { BloodType } from '../types'
import { mockCauses } from '../mocks/causes'
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

  const causes = useMemo(
    () => mockCauses.filter((c) => c.active),
    [],
  )

  const compatibleCauses = useMemo(() => {
    if (!user) return causes

    const canDonateTo = bloodTypeCompatibility[user.bloodType] || []
    return causes.filter((cause) =>
      cause.bloodTypesNeeded.some((bt) => canDonateTo.includes(bt))
    )
  }, [user, causes])

  const getCauseById = useCallback((id: string) => {
    return mockCauses.find((c) => c.id === id) || null
  }, [])

  return {
    causes,
    compatibleCauses,
    getCauseById,
  }
}
