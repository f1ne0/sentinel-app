import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { COLORS } from '../constants';

export function Sparkline({ data, color = COLORS.info }: { data: number[]; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={38}>
      <LineChart data={data.map((value, index) => ({ index, value }))}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive />
      </LineChart>
    </ResponsiveContainer>
  );
}
