import { analyses } from '../mock/analyses';
import { iocs } from '../mock/iocs';
import { threatFeed } from '../mock/threatFeed';
import type { Analysis, IOC, Severity, ThreatFeedItem, Verdict } from '../types';
import { riskToSeverity } from '../utils';

export interface AnalysisFilters {
  search?: string;
  verdicts?: Verdict[];
  severity?: Severity | 'all';
  family?: string;
  sortBy?: 'date' | 'risk' | 'filename';
}

export interface IocFilters {
  search?: string;
  type?: string;
  severity?: Severity | 'all';
}

const wait = (ms: number): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, ms));
const uploadedAnalyses: Analysis[] = [];

export const fetchAnalyses = async (params: AnalysisFilters = {}): Promise<Analysis[]> => {
  await wait(650 + Math.random() * 450);
  const search = params.search?.toLowerCase().trim();
  let result = [...uploadedAnalyses, ...analyses].filter((item) => {
    const matchesSearch = !search || item.fileName.toLowerCase().includes(search) || item.sha256.includes(search);
    const matchesVerdict = !params.verdicts?.length || params.verdicts.includes(item.verdict);
    const matchesSeverity = !params.severity || params.severity === 'all' || item.severity === params.severity;
    const matchesFamily = !params.family || params.family === 'all' || item.malwareFamily === params.family;
    return matchesSearch && matchesVerdict && matchesSeverity && matchesFamily;
  });

  if (params.sortBy === 'risk') result = [...result].sort((a, b) => b.riskScore - a.riskScore);
  else if (params.sortBy === 'filename') result = [...result].sort((a, b) => a.fileName.localeCompare(b.fileName));
  else result = [...result].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  return result;
};

export const fetchAnalysisById = async (id: string): Promise<Analysis> => {
  await wait(400);
  const analysis = [...uploadedAnalyses, ...analyses].find((item) => item.id === id);
  if (!analysis) throw new Error('Analysis not found');
  return analysis;
};

export type UploadStage = 'hash' | 'static' | 'dynamic' | 'ml';
export interface UploadProgress {
  progress: number;
  stage: UploadStage;
  label: string;
}

export const analyzeSample = async (file: File, onProgress: (progress: UploadProgress) => void): Promise<Analysis> => {
  const stages: UploadProgress[] = [
    { progress: 12, stage: 'hash', label: 'Вычисление хэшей...' },
    { progress: 25, stage: 'hash', label: 'Вычисление хэшей...' },
    { progress: 42, stage: 'static', label: 'Статический анализ: разбор PE-структуры и извлечение строк...' },
    { progress: 55, stage: 'static', label: 'Статический анализ: разбор PE-структуры и извлечение строк...' },
    { progress: 72, stage: 'dynamic', label: 'Динамический анализ: sandbox-детонация...' },
    { progress: 85, stage: 'dynamic', label: 'Динамический анализ: sandbox-детонация...' },
    { progress: 100, stage: 'ml', label: 'ML-классификация: ансамблевый вердикт...' },
  ];

  for (const stage of stages) {
    await wait(820);
    onProgress(stage);
  }

  const risk = Math.min(98, Math.max(18, Math.round((file.size % 100) + file.name.length * 2.1)));
  const verdict: Verdict = risk > 72 ? 'malicious' : risk > 42 ? 'suspicious' : 'benign';
  const base = analyses.find((item) => item.verdict === verdict) ?? analyses[0];
  const result: Analysis = {
    ...base,
    id: `uploaded-${Date.now()}`,
    fileName: file.name,
    fileSize: file.size,
    verdict,
    severity: riskToSeverity(risk),
    riskScore: risk,
    confidence: Math.min(99, 68 + (file.name.length % 25)),
    createdAt: new Date().toISOString(),
    source: 'manual_upload',
    explanation: 'Mock-анализ завершён без чтения или исполнения содержимого файла. SENTINEL использовал только метаданные файла и имитацию статического, динамического и ML-этапов для демонстрации индивидуального проекта.',
  };
  uploadedAnalyses.unshift(result);
  return result;
};

export const fetchIOCs = async (filters: IocFilters = {}): Promise<IOC[]> => {
  await wait(520);
  const search = filters.search?.toLowerCase().trim();
  return iocs.filter((ioc) => {
    const matchesSearch = !search || ioc.value.toLowerCase().includes(search);
    const matchesType = !filters.type || filters.type === 'all' || ioc.type === filters.type;
    const matchesSeverity = !filters.severity || filters.severity === 'all' || ioc.severity === filters.severity;
    return matchesSearch && matchesType && matchesSeverity;
  });
};

export const fetchThreatFeed = async (): Promise<ThreatFeedItem[]> => {
  await wait(700);
  return threatFeed;
};
