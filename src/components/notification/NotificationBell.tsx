import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import NotificationList from './NotificationList';
import type { Notification } from '../../types';

interface NotificationBellProps {
  notifications?: Notification[];
  onMarkAllRead?: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

export default function NotificationBell({
  notifications = [],
  onMarkAllRead,
  onNotificationClick,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-danger rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 z-50">
          <NotificationList
            notifications={notifications}
            onMarkAllRead={() => {
              onMarkAllRead?.();
            }}
            onNotificationClick={(n) => {
              onNotificationClick?.(n);
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
