import { NavLink, useNavigate } from 'react-router-dom';
import {
  Droplets,
  Home,
  AlertCircle,
  CalendarCheck,
  BookOpen,
  MapPin,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/causes', icon: AlertCircle, label: 'Alertas' },
  { to: '/donations', icon: CalendarCheck, label: 'Minhas Doações' },
  { to: '/education', icon: BookOpen, label: 'Educação' },
  { to: '/blood-centers', icon: MapPin, label: 'Mapa de Hemocentros' },
];

const bottomNavItems = [
  { to: '/profile', icon: User, label: 'Meu Perfil' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userName = user?.name ?? 'Usuário';
  const bloodType = user?.bloodType;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`flex flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-30 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <Droplets className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold text-dark">
              Sangue <span className="text-primary">Vivo</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-light text-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <ul className="flex flex-col gap-1">
              {bottomNavItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-light text-primary'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full cursor-pointer"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  <span>Sair</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <div className="px-4 py-4 border-t border-gray-200 shrink-0">
          <NavLink to="/profile" onClick={onClose} className="flex items-center gap-3 px-2 hover:opacity-80 transition-opacity">
            <Avatar name={userName} bloodType={bloodType} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-dark truncate">{userName}</p>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
}
