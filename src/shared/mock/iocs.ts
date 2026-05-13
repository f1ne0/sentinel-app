import type { IOC, IocType, MalwareFamily, Severity } from '../types';
import { threatActors } from './threatActors';

const types: IocType[] = ['hash', 'url', 'ip', 'domain', 'mutex'];
const severities: Severity[] = ['low', 'medium', 'high', 'critical'];
const families: MalwareFamily[] = ['Emotet', 'AgentTesla', 'QakBot', 'RedLine', 'AsyncRAT', 'LockBit', 'Unknown'];

const safeValue = (type: IocType, index: number): string => {
  if (type === 'hash') return `${index.toString(16).padStart(2, '0')}${'a3f0c9d1b7e5'.repeat(5)}`.slice(0, 64);
  if (type === 'url') return `https://ioc-${index}.example.test/api/checkin`;
  if (type === 'ip') return `198.51.100.${(index % 200) + 10}`;
  if (type === 'domain') return `cdn-${index}.example.test`;
  return `Global\\SENTINEL_MOCK_MUTEX_${index}`;
};

export const iocs: IOC[] = Array.from({ length: 56 }, (_, index) => {
  const type = types[index % types.length];
  return {
    id: `ioc-${index + 1}`,
    type,
    value: safeValue(type, index + 1),
    firstSeen: new Date(Date.now() - (index + 12) * 7_200_000).toISOString(),
    lastSeen: new Date(Date.now() - index * 2_400_000).toISOString(),
    hits: (index * 7) % 41 + 1,
    severity: severities[index % severities.length],
    source: ['sandbox', 'статические строки', 'сетевая телеметрия', 'заметка аналитика'][index % 4],
    relatedAnalysisIds: [`sample-${(index % 40) + 1}`, `sample-${((index + 9) % 40) + 1}`],
    threatActors: [threatActors[index % threatActors.length]],
    malwareFamilies: [families[index % families.length]],
  };
});
