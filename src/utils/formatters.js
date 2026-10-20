// Format number into Chilean Pesos (CLP) -> $48.500.000 CLP
export function formatCLP(amount, withCurrencySuffix = true) {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0 CLP';
  const formatted = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount);
  
  return withCurrencySuffix ? `${formatted} CLP` : formatted;
}

// Format date into Chilean Spanish (e.g. "18 Oct 2024")
export function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

// Format Chilean RUT
export function formatRUT(rut) {
  if (!rut) return '';
  const clean = rut.replace(/[^0-9kK]/g, '');
  if (clean.length < 2) return clean;
  const dv = clean.slice(-1).toUpperCase();
  let body = clean.slice(0, -1);
  let formatted = '';
  while (body.length > 3) {
    formatted = '.' + body.slice(-3) + formatted;
    body = body.slice(0, -3);
  }
  formatted = body + formatted;
  return `${formatted}-${dv}`;
}

// Badges and styles for financial status
export const STATUS_STYLES = {
  // Finance statuses
  Pagado: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
    label: 'Pagado',
  },
  Pendiente: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dot: 'bg-amber-500',
    label: 'Pendiente',
  },
  Atrasado: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-500',
    label: 'Atrasado / Vencido',
  },
  // CRM project statuses
  'En Negociación': {
    bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dot: 'bg-blue-500',
    label: 'En Negociación',
  },
  'Proyecto Activo': {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
    label: 'Proyecto Activo',
  },
  'Finalizado': {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    label: 'Finalizado',
  },
  'En Pausa': {
    bg: 'bg-slate-50 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    label: 'En Pausa',
  },
};
