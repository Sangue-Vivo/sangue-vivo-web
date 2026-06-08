import { AxiosError } from 'axios'
import { BloodType, Gender, type User } from '../types'

interface ApiUser {
  id: string
  email: string
  name: string
  cpf: string
  phone?: string
  birthDate: string
  gender: string
  bloodType: string
  university?: string
  course?: string
  semester?: number
  avatarUrl?: string | null
  role: 'user' | 'admin'
  totalDonations?: number
  lastDonationDate?: string | null
  nextEligibleDate?: string | null
  isEligible?: boolean
  consecutiveStreak?: number
  createdAt: string
  updatedAt: string
}

// Cada doação de sangue pode salvar até 4 vidas.
const LIVES_PER_DONATION = 4

export function mapUser(u: ApiUser): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    cpf: u.cpf,
    phone: u.phone ?? '',
    birthDate: new Date(u.birthDate),
    gender: u.gender as Gender,
    bloodType: u.bloodType as BloodType,
    university: u.university ?? '',
    course: u.course ?? '',
    semester: u.semester ?? 0,
    avatarUrl: u.avatarUrl ?? null,
    role: u.role,
    potentialLivesSaved: (u.totalDonations ?? 0) * LIVES_PER_DONATION,
    lastDonationDate: u.lastDonationDate ? new Date(u.lastDonationDate) : null,
    nextEligibleDate: u.nextEligibleDate ? new Date(u.nextEligibleDate) : null,
    isEligible: u.isEligible ?? false,
    consecutiveStreak: u.consecutiveStreak ?? 0,
    createdAt: new Date(u.createdAt),
    updatedAt: new Date(u.updatedAt),
  }
}

export function apiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof AxiosError) {
    if (err.code === 'ECONNABORTED') {
      return 'O servidor demorou a responder. Ele pode estar reiniciando — tente de novo em alguns segundos.'
    }
    const apiError = err.response?.data?.error
    if (typeof apiError === 'string' && apiError.length > 0) return apiError
    if (!err.response) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão.'
    }
  }
  return fallback
}
