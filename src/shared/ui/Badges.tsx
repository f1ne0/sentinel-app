import { Badge, HStack, Text } from '@chakra-ui/react';
import { FiAlertTriangle, FiCheckCircle, FiXOctagon } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import type { Severity, Verdict } from '../types';
import { getSeverityColor, getVerdictColor, translateSeverity, translateVerdict } from '../utils';

const verdictIcons: Record<Verdict, IconType> = {
  benign: FiCheckCircle,
  suspicious: FiAlertTriangle,
  malicious: FiXOctagon,
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const Icon = verdictIcons[verdict];
  const color = getVerdictColor(verdict);
  return (
    <Badge h="22px" px="8px" borderRadius="md" bg={`${color}14`} color={color} border="1px solid" borderColor={`${color}66`} textTransform="none">
      <HStack spacing="6px" h="100%">
        <Icon size={12} />
        <Text fontSize="11px" fontWeight="600" letterSpacing="0.06em" lineHeight="1">{translateVerdict(verdict).toUpperCase()}</Text>
      </HStack>
    </Badge>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const color = getSeverityColor(severity);
  return <Badge h="22px" px="8px" borderRadius="md" bg={`${color}14`} color={color} border="1px solid" borderColor={`${color}66`} fontSize="11px" fontWeight="600" letterSpacing="0.06em" textTransform="uppercase">{translateSeverity(severity)}</Badge>;
}
