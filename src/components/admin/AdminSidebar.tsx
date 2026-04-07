import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  Droplets,
  Bell,
  Settings,
  ArrowLeft,
  X,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../ui/Avatar'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: Users, label: 'Usuários' },
  { to: '/admin/causes', icon: HeartHandshake, label: 'Causas' },
  { to: '/admin/donations', icon: Droplets, label: 'Doações' },
  { to: '/admin/notifications', icon: Bell, label: 'Notificações' },
  { to: '/admin/settings', icon: Settings, label: 'Configurações' },
]

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const { user } = useAuth()

  return (
    <>
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#1C1917] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo + Close */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600">
              <Droplets className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-jakarta text-lg font-bold text-white">Sangue Vivo</span>
              <span className="rounded-md bg-red-600/20 px-2 py-0.5 text-xs font-semibold text-red-400">
                Admin
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto border-t border-white/10 p-4">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="mb-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </NavLink>

          {user && (
            <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
              <Avatar name={user.name} bloodType={user.bloodType} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-gray-400">Administrador</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
