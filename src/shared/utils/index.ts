import { SEVERITY_COLORS, VERDICT_COLORS } from '../constants';
import type { Severity, Source, Verdict } from '../types';

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

export const formatHash = (hash: string, edge = 8): string => `${hash.slice(0, edge)}...${hash.slice(-edge)}`;

export const formatDate = (date: string): string =>
  new Intl.DateTimeFormat('ru-RU', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

export const getVerdictColor = (verdict: Verdict): string => VERDICT_COLORS[verdict];
export const getSeverityColor = (severity: Severity): string => SEVERITY_COLORS[severity];

export const riskToSeverity = (risk: number): Severity => {
  if (risk >= 85) return 'critical';
  if (risk >= 65) return 'high';
  if (risk >= 35) return 'medium';
  return 'low';
};

export const titleCase = (value: string): string =>
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const translateVerdict = (verdict: Verdict): string => {
  const labels: Record<Verdict, string> = {
    benign: 'безопасный',
    suspicious: 'подозрительный',
    malicious: 'вредоносный',
  };
  return labels[verdict];
};

export const translateSeverity = (severity: Severity): string => {
  const labels: Record<Severity, string> = {
    low: 'низкий',
    medium: 'средний',
    high: 'высокий',
    critical: 'критический',
  };
  return labels[severity];
};

export const translateSource = (source: Source): string => {
  const labels: Record<Source, string> = {
    manual_upload: 'ручная загрузка',
    api: 'API',
    email_gateway: 'почтовый шлюз',
    edr: 'EDR',
    soc_referral: 'SOC-направление',
  };
  return labels[source];
};
