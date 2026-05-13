export const queryKeys = {
  analyses: ['analyses'] as const,
  analysis: (id: string) => ['analysis', id] as const,
  iocs: ['iocs'] as const,
  threatFeed: ['threatFeed'] as const,
};
