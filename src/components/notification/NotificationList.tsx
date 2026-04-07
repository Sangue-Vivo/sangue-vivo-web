import {
  Bell,
  CalendarCheck,
  Heart,
  Info,
} from 'lucide-react';
import { NotificationType, type Notification } from '../../types';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAllRead?: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

const typeIcons: Record<NotificationType, React.ElementType> = {
  [NotificationType.ELIGIBLE_TO_DONATE]: CalendarCheck,
  [NotificationType.DONATION_REMINDER]: Bell,
  [NotificationType.CAUSE_MATCH]: Heart,
  [NotificationType.GENERAL]: Info,
};

const typeColors: Record<NotificationType, string> = {
  [NotificationType.ELIGIBLE_TO_DONATE]: 'bg-green-100 text-success',
  [NotificationType.DONATION_REMINDER]: 'bg-blue-100 text-info',
  [NotificationType.CAUSE_MATCH]: 'bg-red-100 text-primary',
  [NotificationType.GENERAL]: 'bg-gray-100 text-gray-700',
};

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'agora';
  if (diffMin < 60) return `${diffMin}min`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d`;
  return `${Math.floor(diffDay / 7)}sem`;
}

export default function NotificationList({
  notifications,
  onMarkAllRead,
  onNotificationClick,
}: NotificationListProps) {
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-bold text-dark">Notificações</h3>
        {hasUnread && onMarkAllRead && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-medium text-primary hover:text-primary-dark transition-colors cursor-pointer"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <Bell className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">Nenhuma notificação</p>
          </div>
        )}

        {notifications.map((notification) => {
          const IconComponent = typeIcons[notification.type];
          const colorClass = typeColors[notification.type];

          return (
            <button
              key={notification.id}
              onClick={() => onNotificationClick?.(notification)}
              className={`
                w-full flex items-start gap-3 px-4 py-3 text-left transition-colors cursor-pointer
                hover:bg-gray-50
                ${!notification.isRead ? 'bg-primary-light/30' : ''}
              `}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}
              >
                <IconComponent className="w-4.5 h-4.5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-sm truncate ${
                      !notification.isRead ? 'font-bold text-dark' : 'font-medium text-gray-700'
                    }`}
                  >
                    {notification.title}
                  </p>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
                    {timeAgo(notification.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
              </div>

              {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
