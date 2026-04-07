import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { BloodType, Gender } from '../types'
import { mockCurrentUser } from '../mocks/users'

export interface RegisterData {
  name: string
  email: string
  cpf: string
  password: string
  bloodType: BloodType
  gender: Gender
  birthDate: string
  university: string
  course: string
}

interface StoredUser {
  user: User
  password: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  registeredUsers: StoredUser[]
  loginAttempts: number
  lastAttemptTime: number | null
  register: (data: RegisterData) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

const mockAdminUser: User = {
  id: 'admin-1',
  email: 'admin@hemoal.gov.br',
  name: 'Administrador Hemoal',
  cpf: '000.000.000-00',
  phone: '(82) 3315-2102',
  birthDate: new Date('1985-01-01'),
  gender: Gender.MALE,
  bloodType: BloodType.O_NEGATIVE,
  university: '',
  course: '',
  semester: 0,
  avatarUrl: null,
  role: 'admin',
  potentialLivesSaved: 0,
  lastDonationDate: null,
  nextEligibleDate: null,
  isEligible: false,
  consecutiveStreak: 0,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
}

const mockAdminMarcelo: User = {
  id: 'admin-2',
  email: 'marcelo@umj.edu.br',
  name: 'Marcelo Lucas de Oliveira Lima',
  cpf: '111.111.111-11',
  phone: '(82) 99999-0000',
  birthDate: new Date('2000-01-01'),
  gender: Gender.MALE,
  bloodType: BloodType.O_POSITIVE,
  university: 'UMJ — Universidade Mário Pontes Jucá',
  course: '',
  semester: 0,
  avatarUrl: null,
  role: 'admin',
  potentialLivesSaved: 0,
  lastDonationDate: null,
  nextEligibleDate: null,
  isEligible: false,
  consecutiveStreak: 0,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
}

const initialUsers: StoredUser[] = [
  { user: mockCurrentUser, password: '123456' },
  { user: mockAdminUser, password: 'admin123' },
  { user: mockAdminMarcelo, password: 'admin123' },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      registeredUsers: initialUsers,
      loginAttempts: 0,
      lastAttemptTime: null,

      register: async (data: RegisterData) => {
        set({ isLoading: true })
        await new Promise((resolve) => setTimeout(resolve, 600))

        const { registeredUsers } = get()

        if (registeredUsers.some((u) => u.user.email === data.email)) {
          set({ isLoading: false })
          throw new Error('Já existe uma conta com este e-mail.')
        }

        if (registeredUsers.some((u) => u.user.cpf === data.cpf)) {
          set({ isLoading: false })
          throw new Error('Já existe uma conta com este CPF.')
        }

        const newUser: User = {
          id: String(registeredUsers.length + 1),
          email: data.email,
          name: data.name,
          cpf: data.cpf,
          phone: '',
          birthDate: new Date(data.birthDate),
          gender: data.gender,
          bloodType: data.bloodType,
          university: data.university,
          course: data.course,
          semester: 1,
          avatarUrl: null,
          role: 'user',
          potentialLivesSaved: 0,
          lastDonationDate: null,
          nextEligibleDate: null,
          isEligible: true,
          consecutiveStreak: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set({
          registeredUsers: [...registeredUsers, { user: newUser, password: data.password }],
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      login: async (email: string, password: string) => {
        const { loginAttempts, lastAttemptTime } = get()
        const now = Date.now()
        const fifteenMinutes = 15 * 60 * 1000

        // Rate limit: block after 5 failed attempts within 15 minutes
        if (loginAttempts >= 5 && lastAttemptTime && (now - lastAttemptTime) < fifteenMinutes) {
          throw new Error('Muitas tentativas. Tente novamente em 15 minutos.')
        }

        // Reset attempts if 15 minutes have passed
        if (lastAttemptTime && (now - lastAttemptTime) >= fifteenMinutes) {
          set({ loginAttempts: 0, lastAttemptTime: null })
        }

        set({ isLoading: true })
        await new Promise((resolve) => setTimeout(resolve, 800))

        const { registeredUsers } = get()
        const found = registeredUsers.find(
          (u) => u.user.email === email && u.password === password
        )

        if (found) {
          set({
            user: found.user,
            isAuthenticated: true,
            isLoading: false,
            loginAttempts: 0,
            lastAttemptTime: null,
          })
        } else {
          set({
            isLoading: false,
            loginAttempts: get().loginAttempts + 1,
            lastAttemptTime: now,
          })
          throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.')
        }
      },

      logout: () => {
        localStorage.removeItem('sangue-vivo-token')
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      updateProfile: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data, updatedAt: new Date() } : null,
        }))
      },
    }),
    {
      name: 'sangue-vivo-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        registeredUsers: state.registeredUsers,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<AuthState> | undefined;
        const persistedUsers = p?.registeredUsers ?? [];
        // Merge: keep initialUsers + any user-registered accounts not in initialUsers
        const initialEmails = new Set(initialUsers.map((u) => u.user.email));
        const extraUsers = persistedUsers.filter((u) => !initialEmails.has(u.user.email));
        return {
          ...current,
          ...p,
          registeredUsers: [...initialUsers, ...extraUsers],
        };
      },
    }
  )
)
