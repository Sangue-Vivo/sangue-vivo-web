import { AxiosError } from 'axios'
import {
  BloodType,
  Gender,
  DonationStatus,
  NotificationType,
  type User,
  type Cause,
  type Donation,
  type CauseDonation,
  type Notification,
} from '../types'

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

function stockFromUrgency(urgency: number): Cause['stockLevel'] {
  if (urgency >= 5) return 'critical'
  if (urgency >= 4) return 'low'
  if (urgency >= 3) return 'moderate'
  return 'stable'
}

interface ApiCause {
  id: string
  title: string
  description: string
  patientName?: string
  bloodType?: string
  hospital: string
  city: string
  urgencyLevel?: number
  goalDonations?: number
  currentDonations?: number
  status?: string
  expiresAt: string
  createdById: string
  createdAt: string
  updatedAt: string
  createdBy?: ApiUser
}

export function mapCause(c: ApiCause): Cause {
  const urgency = c.urgencyLevel ?? 1
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    hospital: c.hospital,
    city: c.city,
    urgencyLevel: urgency,
    stockLevel: stockFromUrgency(urgency),
    bloodTypesNeeded: c.bloodType ? [c.bloodType as BloodType] : [],
    active: c.status === 'ACTIVE',
    expiresAt: new Date(c.expiresAt),
    createdById: c.createdById,
    createdBy: c.createdBy ? mapUser(c.createdBy) : (undefined as unknown as User),
    donations: [],
    createdAt: new Date(c.createdAt),
    updatedAt: new Date(c.updatedAt),
    patientName: c.patientName,
    goalDonations: c.goalDonations,
    currentDonations: c.currentDonations,
    status: c.status as Cause['status'],
  }
}

interface ApiDonation {
  id: string
  userId: string
  scheduledDate: string
  completedDate?: string | null
  status: string
  hospital: string
  city: string
  xpEarned?: number
  createdAt: string
  updatedAt: string
  user?: ApiUser
  causeDonation?: {
    id: string
    causeId: string
    donationId: string
    createdAt: string
    cause?: ApiCause
  } | null
}

export function mapDonation(d: ApiDonation): Donation {
  let causeDonation: CauseDonation | null = null
  if (d.causeDonation) {
    causeDonation = {
      id: d.causeDonation.id,
      causeId: d.causeDonation.causeId,
      cause: d.causeDonation.cause ? mapCause(d.causeDonation.cause) : (undefined as unknown as Cause),
      donationId: d.causeDonation.donationId,
      donation: undefined as unknown as Donation,
      createdAt: new Date(d.causeDonation.createdAt),
    }
  }
  return {
    id: d.id,
    userId: d.userId,
    user: d.user ? mapUser(d.user) : (undefined as unknown as User),
    scheduledDate: new Date(d.scheduledDate),
    completedDate: d.completedDate ? new Date(d.completedDate) : null,
    status: d.status as DonationStatus,
    hospital: d.hospital,
    city: d.city,
    causeDonation,
    createdAt: new Date(d.createdAt),
    updatedAt: new Date(d.updatedAt),
  }
}

const KNOWN_NOTIFICATION_TYPES = new Set(Object.values(NotificationType) as string[])

interface ApiNotification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  isRead: boolean
  actionUrl?: string | null
  createdAt: string
}

export function mapNotification(n: ApiNotification): Notification {
  return {
    id: n.id,
    userId: n.userId,
    user: undefined as unknown as User,
    type: (KNOWN_NOTIFICATION_TYPES.has(n.type) ? n.type : NotificationType.GENERAL) as NotificationType,
    title: n.title,
    message: n.message,
    isRead: n.isRead,
    actionUrl: n.actionUrl ?? null,
    createdAt: new Date(n.createdAt),
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
