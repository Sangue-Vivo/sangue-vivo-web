import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, Menu, User, LogOut, Settings, ChevronDown, Shield } from 'lucide-react';
import NotificationBell from '../notification/NotificationBell';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { useNotificationStore } from '../../stores/notificationStore';
import { useState } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const notifications = useNotificationStore((s) => s.notifications);
  const loadNotifications = useNotificationStore((s) => s.load);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const markAsRead = useNotificationStore((s) => s.markAsRead);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const userName = user?.name ?? 'Usuário';
  const bloodType = user?.bloodType;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
              <Droplets className="w-7 h-7 text-primary" />
              <span className="text-xl font-bold text-dark hidden sm:inline">
                Sangue <span className="text-primary">Vivo</span>
              </span>
            </Link>
          </div>

          {/* Right: Notifications + Profile */}
          <div className="flex items-center gap-3">
            <NotificationBell
              notifications={notifications}
              onMarkAllRead={markAllAsRead}
              onNotificationClick={(n) => markAsRead(n.id)}
            />

            {/* Profile dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Avatar name={userName} bloodType={bloodType} size="sm" />
                <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate hidden sm:inline">
                  {userName}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform hidden sm:block ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-dark">{userName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary font-semibold hover:bg-primary-light transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Painel Admin
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      Meu Perfil
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      Configurações
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
