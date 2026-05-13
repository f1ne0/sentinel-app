import { Box, Text } from '@chakra-ui/react';
import { getSeverityColor, riskToSeverity } from '../utils';

export function RiskRing({ value, size = 104 }: { value: number; size?: number }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getSeverityColor(riskToSeverity(value));
  return (
    <Box position="relative" w={`${size}px`} h={`${size}px`}>
      <svg width={size} height={size} role="img" aria-label={`Оценка риска ${value}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(228,231,236,0.08)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <Text position="absolute" inset="0" display="grid" placeItems="center" fontFamily="mono" fontWeight="500" lineHeight="1.1" fontSize={size > 90 ? '2xl' : 'lg'}>{value}</Text>
    </Box>
  );
}
