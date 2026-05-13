import type { Severity, Verdict } from '../types';

export const ROUTES = {
  dashboard: '/',
  upload: '/upload',
  history: '/history',
  reports: '/reports',
  insights: '/insights',
  indicators: '/indicators',
  mitre: '/mitre',
  threats: '/threats',
  analysis: (id: string) => `/analysis/${id}`,
} as const;

export const COLORS = {
  bgBase: '#08090C',
  bgSurface: '#0F1116',
  bgElevated: '#15181F',
  borderSubtle: '#1A1E27',
  borderStrong: '#252A35',
  textPrimary: '#E4E7EC',
  textSecondary: '#8B919D',
  textMuted: '#5A6068',
  critical: '#FF4757',
  warning: '#FFA726',
  safe: '#10B981',
  info: '#06B6D4',
  ai: '#A78BFA',
} as const;

export const VERDICT_COLORS: Record<Verdict, string> = {
  benign: COLORS.safe,
  suspicious: COLORS.warning,
  malicious: COLORS.critical,
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  low: COLORS.safe,
  medium: COLORS.info,
  high: COLORS.warning,
  critical: COLORS.critical,
};

export const PAGE_SIZE = 20;
