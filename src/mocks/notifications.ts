import { NotificationType } from '../types'
import type { Notification } from '../types'
import { mockCurrentUser } from './users'

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: '1',
    user: mockCurrentUser,
    type: NotificationType.ELIGIBLE_TO_DONATE,
    title: 'Você já pode doar novamente!',
    message:
      'Seu período de espera terminou. Você está elegível para realizar uma nova doação de sangue. Agende agora!',
    isRead: false,
    actionUrl: '/agendar',
    createdAt: new Date('2026-03-10'),
  },
  {
    id: 'notif-2',
    userId: '1',
    user: mockCurrentUser,
    type: NotificationType.DONATION_REMINDER,
    title: 'Lembrete: Doação agendada para 28/03',
    message:
      'Sua doação está agendada para 28/03 no HEMO — Hemocentro de Alagoas. Não esqueça de se hidratar bem!',
    isRead: false,
    actionUrl: '/minhas-doacoes',
    createdAt: new Date('2026-03-25'),
  },
  {
    id: 'notif-3',
    userId: '1',
    user: mockCurrentUser,
    type: NotificationType.CAUSE_MATCH,
    title: 'Causa compatível encontrada!',
    message:
      'A causa "Estoque Crítico de O- — Hemoal Maceió" precisa do seu tipo sanguíneo. Sua doação pode ajudar a manter o estoque!',
    isRead: false,
    actionUrl: '/causas/cause-1',
    createdAt: new Date('2026-03-20'),
  },
  {
    id: 'notif-4',
    userId: '1',
    user: mockCurrentUser,
    type: NotificationType.CAUSE_MATCH,
    title: 'Nova causa urgente!',
    message:
      'A causa "Estoque Crítico de B- — Hemoal Maceió" foi criada com urgência alta. Verifique se você pode ajudar.',
    isRead: false,
    actionUrl: '/causas/cause-4',
    createdAt: new Date('2026-03-22'),
  },
  {
    id: 'notif-5',
    userId: '1',
    user: mockCurrentUser,
    type: NotificationType.GENERAL,
    title: 'Campanha de doação na UFAL',
    message:
      'A UFAL está organizando uma campanha de doação de sangue no campus A.C. Simões no dia 05/04. Participe!',
    isRead: true,
    actionUrl: null,
    createdAt: new Date('2026-03-18'),
  },
  {
    id: 'notif-6',
    userId: '1',
    user: mockCurrentUser,
    type: NotificationType.GENERAL,
    title: 'Obrigado por doar!',
    message:
      'Sua doação de dezembro foi processada com sucesso. Cada doação pode potencialmente ajudar até 4 pessoas. Obrigado por fazer a diferença!',
    isRead: true,
    actionUrl: '/minhas-doacoes',
    createdAt: new Date('2025-12-10'),
  },
]
