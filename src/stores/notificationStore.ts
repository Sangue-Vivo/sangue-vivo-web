import { create } from 'zustand'
import type { Notification } from '../types'
import { mockNotifications } from '../mocks/notifications'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Notification) => void
}

function countUnread(notifications: Notification[]): number {
  return notifications.filter((n) => !n.isRead).length
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: mockNotifications,
  unreadCount: countUnread(mockNotifications),

  markAsRead: (id: string) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      )
      return {
        notifications: updated,
        unreadCount: countUnread(updated),
      }
    })
  },

  markAllAsRead: () => {
    set((state) => {
      const updated = state.notifications.map((n) => ({ ...n, isRead: true }))
      return {
        notifications: updated,
        unreadCount: 0,
      }
    })
  },

  addNotification: (notification: Notification) => {
    set((state) => {
      const updated = [notification, ...state.notifications]
      return {
        notifications: updated,
        unreadCount: countUnread(updated),
      }
    })
  },
}))
