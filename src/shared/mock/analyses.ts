import type { Analysis, FileType, MalwareFamily, PeSection, Severity, Source, TimelineEvent, Verdict } from '../types';
import { iocs } from './iocs';
import { mitreTechniques } from './mitreData';
import { yaraRules } from './yaraRules';

const names = [
  'Emotet_dropper.exe', 'invoice_scan.pdf.lnk', 'update.ps1', 'setup.msi', 'obfuscated.js',
  'delivery_notice.docm', 'chrome_update.exe', 'QakBot_loader.bin', 'salary_2026.xlsm', 'vpn_patch.exe',
  'agent_report.scr', 'signed_installer.msi', 'backup_tool.exe', 'redline_panel.js', 'tax_refund.pdf.exe',
  'secure_message.html', 'LockBit_note.exe', 'AsyncRAT_client.exe', 'browser_export.zip', 'finance_form.iso',
  'teams_cache.tmp.exe', 'printer_driver.exe', 'contract_urgent.docm', 'shipping_label.lnk', 'support_tool.exe',
  'payload_stage2.dll', 'onedrive_update.vbs', 'bank_statement.pdf.exe', 'hr_policy.chm', 'ZoomCodec.exe',
  'archive_viewer.exe', 'macro_payload.xlsm', 'telegram_cache.exe', 'invoice_2024.pdf.exe', 'screenconnect_patch.msi',
  'powershell_loader.txt', 'cdn_probe.js', 'kernel_helper.sys', 'report_builder.exe', 'clean_vendor_tool.exe',
  'benign_pdf_reader.exe', 'diagnostic_collector.ps1',
];

const verdicts: Verdict[] = ['malicious', 'suspicious', 'benign', 'malicious', 'suspicious'];
const families: MalwareFamily[] = ['Emotet', 'QakBot', 'None', 'RedLine', 'AgentTesla', 'LockBit', 'AsyncRAT', 'Unknown'];
const sources: Source[] = ['manual_upload', 'api', 'email_gateway', 'edr', 'soc_referral'];
const fileTypes: FileType[] = ['pe', 'script', 'document', 'installer', 'archive', 'pdf'];
const apis = ['VirtualAllocEx', 'WriteProcessMemory', 'CreateRemoteThread', 'RegSetValueEx', 'WinExec', 'CryptEncrypt', 'InternetOpenUrlW'];
const libs = ['kernel32.dll', 'advapi32.dll', 'wininet.dll', 'user32.dll', 'bcrypt.dll', 'ws2_32.dll'];

const hex = (seed: number, length: number): string =>
  Array.from({ length }, (_, index) => ((seed * 31 + index * 17 + 13) % 16).toString(16)).join('');

const sections = (index: number): PeSection[] =>
  ['.text', '.rdata', '.data', '.rsrc', '.packed'].map((name, sectionIndex) => ({
    name,
    virtualSize: 8192 + index * 103 + sectionIndex * 4096,
    rawSize: 4096 + index * 71 + sectionIndex * 2048,
    entropy: Number((4.2 + ((index + sectionIndex) % 6) * 0.63).toFixed(2)),
    characteristics: sectionIndex === 4 ? 'MEM_EXECUTE | MEM_WRITE' : 'MEM_READ',
    suspicious: sectionIndex === 4 || ((index + sectionIndex) % 7 === 0),
  }));

const timeline = (index: number, severity: Severity): TimelineEvent[] => [
  { id: `tl-${index}-1`, timestamp: '00:00:04', category: 'process', title: 'Создан начальный процесс', detail: `${names[index % names.length]} запущен в sandbox-профиле.`, severity: 'low' },
  { id: `tl-${index}-2`, timestamp: '00:00:18', category: 'registry', title: 'Запись registry key', detail: 'Обнаружен mock-путь persistence через Run key.', severity },
  { id: `tl-${index}-3`, timestamp: '00:00:31', category: 'network', title: 'Попытка HTTP-маяка', detail: `Соединение с api-${index}.example.test через HTTPS.`, severity },
  { id: `tl-${index}-4`, timestamp: '00:01:05', category: 'file', title: 'Сброшен temp-артефакт', detail: 'Синтетический payload записан в пользовательскую temp-директорию.', severity: severity === 'critical' ? 'high' : severity },
];

const severityFromRisk = (risk: number): Severity => (risk >= 85 ? 'critical' : risk >= 65 ? 'high' : risk >= 35 ? 'medium' : 'low');

export const analyses: Analysis[] = names.map((fileName, index) => {
  const verdict = verdicts[index % verdicts.length];
  const riskScore = verdict === 'malicious' ? 78 + (index % 21) : verdict === 'suspicious' ? 42 + (index % 30) : 6 + (index % 24);
  const severity = severityFromRisk(riskScore);
  const family = verdict === 'benign' ? 'None' : families[index % families.length];
  const sampleIocs = iocs.slice(index % 20, (index % 20) + 5);
  return {
    id: `sample-${index + 1}`,
    fileName,
    fileSize: 24_000 + index * 184_321,
    md5: hex(index + 3, 32),
    sha1: hex(index + 9, 40),
    sha256: hex(index + 17, 64),
    imphash: hex(index + 23, 32),
    ssdeep: `${12288 + index}:mock${hex(index, 24)}:sentinel${index}`,
    mimeType: index % 3 === 0 ? 'application/x-msdownload' : index % 3 === 1 ? 'application/x-powershell' : 'application/octet-stream',
    fileType: fileTypes[index % fileTypes.length],
    signedBy: verdict === 'benign' ? 'Contoso Software Ltd.' : index % 4 === 0 ? 'Unknown Publisher' : null,
    compileTimestamp: new Date(Date.now() - (index + 18) * 86_400_000).toISOString(),
    verdict,
    severity,
    riskScore,
    confidence: Math.min(99, 72 + (index * 5) % 26),
    malwareFamily: family,
    createdAt: new Date(Date.now() - index * 7_200_000).toISOString(),
    analyst: ['M. Karimov', 'D. Yunusova', 'A. Saidov', 'N. Rasulov'][index % 4],
    source: sources[index % sources.length],
    staticFeatures: {
      entropy: Number((4.9 + (index % 5) * 0.72).toFixed(2)),
      suspiciousStrings: ['%TEMP%\\update.exe', 'powershell -w hidden', 'Software\\Microsoft\\Windows\\CurrentVersion\\Run', 'Login Data'],
      suspiciousUrls: [`https://api-${index + 1}.example.test/checkin`, `https://cdn-${index + 1}.example.test/stage`],
      importedLibraries: libs.slice(0, 3 + (index % 4)),
      suspiciousApis: apis.slice(0, 3 + (index % 4)),
      peSections: sections(index),
      sectionCount: 5,
    },
    dynamicFeatures: {
      networkConnections: verdict === 'benign' ? index % 2 : 3 + (index % 9),
      fileModifications: verdict === 'benign' ? 1 : 4 + (index % 10),
      registryChanges: verdict === 'benign' ? 0 : 2 + (index % 7),
      processCreations: 1 + (index % 6),
      memoryActivity: riskScore + 8,
      suspiciousBehaviorScore: Math.min(100, riskScore + (index % 8)),
      timeline: timeline(index, severity),
      processTree: {
        id: `proc-${index}-root`,
        name: fileName,
        pid: 1800 + index,
        commandLine: `C:\\Users\\Analyst\\Downloads\\${fileName}`,
        children: verdict === 'benign' ? [] : [
          { id: `proc-${index}-ps`, name: 'powershell.exe', pid: 3200 + index, commandLine: 'powershell.exe -NoProfile -ExecutionPolicy Bypass', children: [] },
          { id: `proc-${index}-cmd`, name: 'cmd.exe', pid: 4200 + index, commandLine: 'cmd.exe /c whoami && ipconfig', children: [] },
        ],
      },
    },
    mitreAttacks: mitreTechniques.slice(index % 5, (index % 5) + 4),
    yaraMatches: verdict === 'benign' ? [] : yaraRules.slice(index % 4, (index % 4) + 3),
    iocs: sampleIocs,
    explanation: verdict === 'benign'
      ? 'Образец показывает низкую вариативность энтропии, отсутствие релевантного persistence-поведения и подозрительной сетевой активности. Статические и динамические признаки соответствуют профилю безопасной утилиты.'
      : 'Образец сочетает секции с высокой энтропией, подозрительные импорты Windows API и sandbox-поведение, похожее на persistence или C2 staging. Вердикт основан на корреляции статических, динамических и ML-признаков.',
    topFeatures: [
      { name: 'Кластер подозрительных API', importance: Math.min(96, riskScore + 6) },
      { name: 'Энтропия секций', importance: Math.min(91, riskScore - 3) },
      { name: 'Сетевые маяки', importance: Math.min(88, riskScore - 8) },
      { name: 'Registry persistence', importance: Math.min(82, riskScore - 13) },
      { name: 'Плотность YARA-правил', importance: Math.min(76, riskScore - 18) },
    ],
  };
});
