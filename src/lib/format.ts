/**
 * Formatting utilities for consistent data display across the platform
 */

export function formatDate(date: string | null | undefined, locale: string = 'ro-RO'): string {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return date;
  }
}

export function formatDateTime(datetime: string | null | undefined, locale: string = 'ro-RO'): string {
  if (!datetime) return '—';
  try {
    const d = new Date(datetime);
    return d.toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ' ' + d.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return datetime;
  }
}

export function formatCurrency(amount: number | null | undefined, currency: string = 'RON', locale: string = 'ro-RO'): string {
  if (amount == null) return '—';
  return amount.toLocaleString(locale) + ' ' + currency;
}

export function formatPercentage(value: number | null | undefined, decimals: number = 0): string {
  if (value == null) return '—';
  return value.toFixed(decimals) + '%';
}

export function getInitials(firstName?: string, lastName?: string): string {
  return (firstName?.[0] ?? '').toUpperCase() + (lastName?.[0] ?? '').toUpperCase();
}

export function getStatusBadgeClass(status: string): string {
  const statusMap: Record<string, string> = {
    'ACTIVE': 'badge-green',
    'INACTIVE': 'badge-gray',
    'INJURED': 'badge-red',
    'SUSPENDED': 'badge-orange',
    'PENDING': 'badge-yellow',
    'PAID': 'badge-green',
    'OVERDUE': 'badge-red',
    'CANCELLED': 'badge-gray',
    'SCHEDULED': 'badge-blue',
    'LIVE': 'badge-purple',
    'FINISHED': 'badge-green',
  };
  return statusMap[status] || 'badge';
}

export function getStatusLabel(status: string, context: 'player' | 'payment' | 'match' | 'training' = 'player'): string {
  const labels: Record<string, Record<string, string>> = {
    player: {
      'ACTIVE': 'Activ',
      'INACTIVE': 'Inactiv',
      'INJURED': 'Accidentat',
      'SUSPENDED': 'Suspendat',
    },
    payment: {
      'PENDING': 'În așteptare',
      'PAID': 'Plătit',
      'OVERDUE': 'Restant',
      'CANCELLED': 'Anulat',
    },
    match: {
      'SCHEDULED': 'Planificat',
      'LIVE': 'Live',
      'FINISHED': 'Terminat',
      'CANCELLED': 'Anulat',
    },
    training: {
      'SCHEDULED': 'Planificat',
      'COMPLETED': 'Finalizat',
      'CANCELLED': 'Anulat',
    },
  };
  return labels[context]?.[status] || status;
}

export function getEmojiForStatus(status: string, context: 'player' | 'payment' | 'match' | 'training' = 'player'): string {
  const emojis: Record<string, Record<string, string>> = {
    player: {
      'ACTIVE': '✅',
      'INACTIVE': '⏸️',
      'INJURED': '🩹',
      'SUSPENDED': '🚫',
    },
    payment: {
      'PENDING': '⏳',
      'PAID': '✅',
      'OVERDUE': '⚠️',
      'CANCELLED': '❌',
    },
    match: {
      'SCHEDULED': '📅',
      'LIVE': '🔴',
      'FINISHED': '🏁',
      'CANCELLED': '❌',
    },
    training: {
      'SCHEDULED': '📅',
      'COMPLETED': '✅',
      'CANCELLED': '❌',
    },
  };
  return emojis[context]?.[status] || '';
}

export function truncate(text: string, length: number = 50): string {
  return text && text.length > length ? text.slice(0, length) + '…' : text;
}

export function formatFullName(firstName?: string, lastName?: string): string {
  return [firstName, lastName].filter(Boolean).join(' ') || 'Necunoscut';
}
