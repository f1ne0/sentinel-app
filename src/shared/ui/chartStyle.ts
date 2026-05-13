import { COLORS } from '../constants';

export const chartTooltipStyle = {
  background: '#0B0D12',
  border: `1px solid ${COLORS.borderStrong}`,
  borderRadius: '6px',
  color: COLORS.textPrimary,
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '11px',
  boxShadow: '0 0 0 1px rgba(6,182,212,0.04)',
};

export const chartAxis = {
  stroke: COLORS.textMuted,
  tick: { fill: COLORS.textMuted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" },
  tickLine: false,
  axisLine: { stroke: COLORS.borderSubtle },
};

export const chartGrid = {
  stroke: COLORS.borderSubtle,
  strokeOpacity: 0.55,
  vertical: false,
};
