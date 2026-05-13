import type { AlertItem } from '../types';

export const alerts: AlertItem[] = Array.from({ length: 16 }, (_, index) => {
  const severities = ['low', 'medium', 'high', 'critical'] as const;
  return {
    id: `alert-${index + 1}`,
    title: ['Обнаружен кластер C2-маяков', 'Подозрительная цепочка PowerShell', 'Зафиксирован IOC высокого риска', 'Sandbox-детонация завершена'][index % 4],
    severity: severities[(index + 1) % severities.length],
    source: ['EDR', 'Почтовый шлюз', 'Лента угроз', 'Sandbox'][index % 4],
    timestamp: new Date(Date.now() - index * 19 * 60_000).toISOString(),
    description: 'Mock-сигнал сформирован на основе статических и поведенческих признаков в лабораторном наборе SENTINEL.',
  };
});
