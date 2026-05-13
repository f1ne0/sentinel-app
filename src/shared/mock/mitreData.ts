import type { MitreTechnique } from '../types';

export const mitreTechniques: MitreTechnique[] = [
  { id: 'T1055', tactic: 'Defense Evasion', name: 'Process Injection', description: 'Внедрение кода в другой процесс для обхода детектирования.', frequency: 31 },
  { id: 'T1486', tactic: 'Impact', name: 'Data Encrypted for Impact', description: 'Шифрование пользовательских данных для нарушения доступности.', frequency: 12 },
  { id: 'T1547.001', tactic: 'Persistence', name: 'Registry Run Keys', description: 'Использование Run-ключей для persistence при старте системы.', frequency: 27 },
  { id: 'T1059.001', tactic: 'Execution', name: 'PowerShell', description: 'Выполнение скриптов через PowerShell.', frequency: 24 },
  { id: 'T1105', tactic: 'Command and Control', name: 'Ingress Tool Transfer', description: 'Передача инструментов с удалённой системы.', frequency: 20 },
  { id: 'T1071.001', tactic: 'Command and Control', name: 'Web Protocols', description: 'Использование HTTP или HTTPS для C2.', frequency: 36 },
  { id: 'T1082', tactic: 'Discovery', name: 'System Information Discovery', description: 'Сбор информации о хосте и ОС.', frequency: 38 },
  { id: 'T1112', tactic: 'Defense Evasion', name: 'Modify Registry', description: 'Изменение registry keys для влияния на поведение системы.', frequency: 22 },
  { id: 'T1027', tactic: 'Defense Evasion', name: 'Obfuscated Files', description: 'Обфускация кода или файлов для затруднения анализа.', frequency: 33 },
  { id: 'T1041', tactic: 'Exfiltration', name: 'Exfiltration Over C2 Channel', description: 'Экфильтрация данных через существующий C2-канал.', frequency: 9 },
  { id: 'T1566.001', tactic: 'Initial Access', name: 'Spearphishing Attachment', description: 'Использование вредоносных вложений для initial access.', frequency: 18 },
  { id: 'T1204.002', tactic: 'Execution', name: 'Malicious File', description: 'Исполнение вредоносного файла пользователем.', frequency: 29 },
];

export const mitreTactics = ['Initial Access', 'Execution', 'Persistence', 'Defense Evasion', 'Discovery', 'Command and Control', 'Exfiltration', 'Impact'];
