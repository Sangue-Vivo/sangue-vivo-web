import { Link, useNavigate } from 'react-router-dom'
import { Bell, ArrowLeft, Search, Menu } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../ui/Avatar'

interface AdminHeaderProps {
  title?: string
  onToggleSidebar: () => void
}

export default function AdminHeader({ title = 'Dashboard', onToggleSidebar }: AdminHeaderProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
      {/* Left: Hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-jakarta text-xl font-bold text-gray-900">{title}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="h-10 w-64 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 transition-colors focus:border-red-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        <button
          type="button"
          onClick={() => navigate('/admin/notifications')}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <Link
          to="/dashboard"
          className="hidden items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 sm:flex"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao site
        </Link>

        {user && (
          <div className="flex items-center gap-2">
            <Avatar name={user.name} bloodType={user.bloodType} size="sm" />
            <span className="hidden text-sm font-medium text-gray-700 sm:block">
              {user.name.split(' ')[0]}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
