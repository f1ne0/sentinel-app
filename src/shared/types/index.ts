export type Verdict = 'benign' | 'suspicious' | 'malicious';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type FileType = 'pe' | 'pdf' | 'script' | 'archive' | 'document' | 'installer';
export type MalwareFamily =
  | 'None'
  | 'Emotet'
  | 'AgentTesla'
  | 'LazarLoader'
  | 'QakBot'
  | 'RedLine'
  | 'AsyncRAT'
  | 'LockBit'
  | 'CobaltStrike'
  | 'Unknown';

export type Source = 'manual_upload' | 'api' | 'email_gateway' | 'edr' | 'soc_referral';
export type IocType = 'hash' | 'url' | 'ip' | 'domain' | 'mutex';

export interface PeSection {
  name: string;
  virtualSize: number;
  rawSize: number;
  entropy: number;
  characteristics: string;
  suspicious: boolean;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  category: 'process' | 'network' | 'file' | 'registry' | 'memory';
  title: string;
  detail: string;
  severity: Severity;
}

export interface ProcessNode {
  id: string;
  name: string;
  pid: number;
  commandLine: string;
  children: ProcessNode[];
}

export interface MitreTechnique {
  id: string;
  tactic: string;
  name: string;
  description: string;
  frequency?: number;
}

export interface YaraRule {
  name: string;
  author: string;
  description: string;
  matchedStrings: { value: string; offset: string }[];
}

export interface IOC {
  id: string;
  type: IocType;
  value: string;
  firstSeen: string;
  lastSeen: string;
  hits: number;
  severity: Severity;
  source: string;
  relatedAnalysisIds: string[];
  threatActors: string[];
  malwareFamilies: MalwareFamily[];
}

export interface StaticFeatures {
  entropy: number;
  suspiciousStrings: string[];
  suspiciousUrls: string[];
  importedLibraries: string[];
  suspiciousApis: string[];
  peSections: PeSection[];
  sectionCount: number;
}

export interface DynamicFeatures {
  networkConnections: number;
  fileModifications: number;
  registryChanges: number;
  processCreations: number;
  memoryActivity: number;
  suspiciousBehaviorScore: number;
  timeline: TimelineEvent[];
  processTree: ProcessNode;
}

export interface Analysis {
  id: string;
  fileName: string;
  fileSize: number;
  md5: string;
  sha1: string;
  sha256: string;
  imphash: string;
  ssdeep: string;
  mimeType: string;
  fileType: FileType;
  signedBy: string | null;
  compileTimestamp: string;
  verdict: Verdict;
  severity: Severity;
  riskScore: number;
  confidence: number;
  malwareFamily: MalwareFamily;
  createdAt: string;
  analyst: string;
  source: Source;
  staticFeatures: StaticFeatures;
  dynamicFeatures: DynamicFeatures;
  mitreAttacks: MitreTechnique[];
  yaraMatches: YaraRule[];
  iocs: IOC[];
  explanation: string;
  topFeatures: { name: string; importance: number }[];
}

export interface AlertItem {
  id: string;
  title: string;
  severity: Severity;
  source: string;
  timestamp: string;
  description: string;
}

export interface ThreatFeedItem {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  source: string;
  timestamp: string;
  tags: string[];
}

export interface InsightPattern {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  reference?: string;
  snippet?: string;
}

export interface AnalystNote {
  id: string;
  author: string;
  timestamp: string;
  body: string;
}
