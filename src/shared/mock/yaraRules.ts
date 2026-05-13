import type { YaraRule } from '../types';

export const yaraRules: YaraRule[] = [
  { name: 'MAL_Generic_ProcessInjection', author: 'SENTINEL Labs', description: 'Detects common process injection API clusters.', matchedStrings: [{ value: 'VirtualAllocEx', offset: '0x4021A0' }, { value: 'CreateRemoteThread', offset: '0x402220' }] },
  { name: 'SUSP_PowerShell_EncodedCommand', author: 'SOC Research', description: 'Encoded PowerShell launcher pattern.', matchedStrings: [{ value: '-EncodedCommand', offset: '0x1180' }] },
  { name: 'MAL_Ransom_Note_Template', author: 'SENTINEL Labs', description: 'Synthetic ransomware note markers.', matchedStrings: [{ value: 'restore_your_files.txt', offset: '0x70F0' }] },
  { name: 'SUSP_AutoRun_Persistence', author: 'DFIR Team', description: 'Registry Run key persistence behavior.', matchedStrings: [{ value: 'Software\\Microsoft\\Windows\\CurrentVersion\\Run', offset: '0x55C2' }] },
  { name: 'MAL_C2_HTTP_Beacon', author: 'SENTINEL Labs', description: 'HTTP beacon markers used in mock C2 traffic.', matchedStrings: [{ value: '/api/checkin', offset: '0x3810' }] },
  { name: 'SUSP_Dropper_TempPath', author: 'Malware Triage', description: 'Dropper writes executable payloads to temp paths.', matchedStrings: [{ value: '%TEMP%\\update.exe', offset: '0x21B8' }] },
  { name: 'MAL_Credential_Theft', author: 'SENTINEL Labs', description: 'Credential access strings and browser storage references.', matchedStrings: [{ value: 'Login Data', offset: '0x6190' }] },
  { name: 'SUSP_JS_Obfuscation', author: 'SOC Research', description: 'JavaScript obfuscation and eval-style execution.', matchedStrings: [{ value: 'String.fromCharCode', offset: '0x0904' }] },
];
