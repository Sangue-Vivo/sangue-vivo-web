import { create } from 'zustand'
import type { Notification } from '../types'
import api from '../services/api'
import { mapNotification } from '../services/mappers'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  load: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  addNotification: (notification: Notification) => void
}

function countUnread(notifications: Notification[]): number {
  return notifications.filter((n) => !n.isRead).length
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  load: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/notifications', { params: { limit: 50 } })
      const notifications = (res.data.data.notifications as unknown[]).map((n) =>
        mapNotification(n as never)
      )
      set({ notifications, unreadCount: countUnread(notifications), loading: false })
    } catch {
      set({ loading: false })
    }
  },

  markAsRead: async (id: string) => {
    set((state) => {
      const updated = state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      return { notifications: updated, unreadCount: countUnread(updated) }
    })
    try {
      await api.patch(`/notifications/${id}/read`)
    } catch {
      /* otimista — ignora falha */
    }
  },

  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }))
    try {
      await api.patch('/notifications/read-all')
    } catch {
      /* otimista — ignora falha */
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => {
      const updated = [notification, ...state.notifications]
      return { notifications: updated, unreadCount: countUnread(updated) }
    })
  },
}))
