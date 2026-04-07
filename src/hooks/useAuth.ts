import { useAuthStore } from '../stores/authStore'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const register = useAuthStore((state) => state.register)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const updateProfile = useAuthStore((state) => state.updateProfile)

  return {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    updateProfile,
  }
}
