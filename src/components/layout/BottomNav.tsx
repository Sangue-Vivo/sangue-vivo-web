import { NavLink } from 'react-router-dom';
import { Home, AlertCircle, Droplets, BookOpen, User } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/causes', icon: AlertCircle, label: 'Alertas' },
  { to: '/blood-centers', icon: Droplets, label: 'Doar', center: true },
  { to: '/education', icon: BookOpen, label: 'Educação' },
  { to: '/profile', icon: User, label: 'Perfil' },
];

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 min-w-[56px] transition-colors ${
                item.center
                  ? ''
                  : isActive
                    ? 'text-primary'
                    : 'text-gray-400 hover:text-gray-700'
              }`
            }
          >
            {({ isActive }) =>
              item.center ? (
                <div className="flex flex-col items-center -mt-4">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                      isActive ? 'bg-primary-dark' : 'bg-primary'
                    }`}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-primary mt-0.5">
                    {item.label}
                  </span>
                </div>
              ) : (
                <>
                  <item.icon className="w-5 h-5" />
                  <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : ''}`}>
                    {item.label}
                  </span>
                </>
              )
            }
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
