import type { ThreatFeedItem } from '../types';

export const threatFeed: ThreatFeedItem[] = Array.from({ length: 24 }, (_, index) => {
  const severities = ['medium', 'high', 'critical', 'low'] as const;
  const titles = [
    'Кампания APT28 использует подписанные decoy-загрузчики',
    'Архивная приманка в стиле Lazarus нацелена на финансовые команды',
    'Инфраструктура FIN7 переезжает на новые example-домены',
    'Обнаружена mock-волна malspam с CVE-тематикой',
    'Семейство credential stealer добавило строки browser wallet',
    'Оператор ransomware тестирует удаление резервных копий',
  ];
  return {
    id: `feed-${index + 1}`,
    severity: severities[index % severities.length],
    title: titles[index % titles.length],
    description: 'Элемент threat intelligence на основе безопасной mock-телеметрии и публичного стиля именования кампаний.',
    source: ['SENTINEL Intel', 'OSINT Mirror', 'Партнёрский SOC', 'Malware Lab'][index % 4],
    timestamp: new Date(Date.now() - index * 46 * 60_000).toISOString(),
    tags: ['mock', ['loader', 'c2', 'phishing', 'ransomware'][index % 4], ['T1055', 'T1071.001', 'T1547.001'][index % 3]],
  };
});
