import { BloodType } from '../types';
import { BLOOD_TYPE_LABELS } from './bloodTypes';

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffMs = startOfTarget.getTime() - startOfToday.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'hoje';
  }

  if (diffDays === 1) {
    return 'amanhã';
  }

  if (diffDays === -1) {
    return 'ontem';
  }

  if (diffDays > 1 && diffDays <= 7) {
    return `em ${diffDays} dias`;
  }

  if (diffDays < -1 && diffDays >= -7) {
    return `há ${Math.abs(diffDays)} dias`;
  }

  if (diffDays < -7 && diffDays >= -30) {
    const weeks = Math.floor(Math.abs(diffDays) / 7);
    return weeks === 1 ? 'há 1 semana' : `há ${weeks} semanas`;
  }

  if (diffDays > 7 && diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? 'em 1 semana' : `em ${weeks} semanas`;
  }

  if (diffDays < -30 && diffDays >= -365) {
    const months = Math.floor(Math.abs(diffDays) / 30);
    return months === 1 ? 'há 1 mês' : `há ${months} meses`;
  }

  if (diffDays > 30 && diffDays <= 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? 'em 1 mês' : `em ${months} meses`;
  }

  if (diffDays < -365) {
    const years = Math.floor(Math.abs(diffDays) / 365);
    return years === 1 ? 'há 1 ano' : `há ${years} anos`;
  }

  const years = Math.floor(diffDays / 365);
  return years === 1 ? 'em 1 ano' : `em ${years} anos`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('pt-BR');
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) {
    return '';
  }
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${first}${last}`;
}

export function formatBloodType(type: BloodType): string {
  return BLOOD_TYPE_LABELS[type];
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}
