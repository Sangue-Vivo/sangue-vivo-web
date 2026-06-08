import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { BloodType, Gender } from '../types'
import api from '../services/api'
import { mapUser, apiErrorMessage } from '../services/mappers'

const TOKEN_KEY = 'sangue-vivo-token'

export interface RegisterData {
  name: string
  email: string
  cpf: string
  password: string
  bloodType?: BloodType
  gender: Gender
  birthDate: string
  university: string
  course: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  register: (data: RegisterData) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  updateProfile: (data: Partial<User>) => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      register: async (data: RegisterData) => {
        if (!data.bloodType) {
          throw new Error(
            'Selecione seu tipo sanguíneo para concluir o cadastro. Você pode descobri-lo no hemocentro mais próximo.'
          )
        }
        set({ isLoading: true })
        try {
          const res = await api.post('/auth/register', {
            name: data.name,
            email: data.email,
            cpf: data.cpf,
            password: data.password,
            bloodType: data.bloodType,
            gender: data.gender,
            birthDate: data.birthDate,
            university: data.university,
            course: data.course,
          })
          const { token, user } = res.data.data
          localStorage.setItem(TOKEN_KEY, token)
          set({ user: mapUser(user), isAuthenticated: true, isLoading: false })
        } catch (err) {
          set({ isLoading: false })
          throw new Error(apiErrorMessage(err, 'Não foi possível criar a conta. Verifique os dados.'))
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const res = await api.post('/auth/login', { email, password })
          const { token, user } = res.data.data
          localStorage.setItem(TOKEN_KEY, token)
          set({ user: mapUser(user), isAuthenticated: true, isLoading: false })
        } catch (err) {
          set({ isLoading: false })
          throw new Error(apiErrorMessage(err, 'Credenciais inválidas. Verifique seu e-mail e senha.'))
        }
      },

      logout: () => {
        localStorage.removeItem(TOKEN_KEY)
        set({ user: null, isAuthenticated: false, isLoading: false })
      },

      // Valida o token no carregamento do app: hidrata o usuário ou limpa sessão inválida.
      checkAuth: async () => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (!token) {
          set({ user: null, isAuthenticated: false })
          return
        }
        try {
          const res = await api.get('/auth/me')
          set({ user: mapUser(res.data.data.user), isAuthenticated: true })
        } catch {
          localStorage.removeItem(TOKEN_KEY)
          set({ user: null, isAuthenticated: false })
        }
      },

      updateProfile: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data, updatedAt: new Date() } : null,
        }))
      },

      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'sangue-vivo-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
