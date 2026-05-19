import { Box, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { GlassCard } from '../../shared/ui/GlassCard';
import { SeverityBadge } from '../../shared/ui/Badges';
import { suspiciousApiPatterns, recommendations } from '../../shared/mock/insights';
import { iocs } from '../../shared/mock/iocs';
import { COLORS } from '../../shared/constants';
import { formatHash } from '../../shared/utils';

function SectionTitle({ children }: { children: string }) {
  return <Heading size="xs" mb="12px" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">{children}</Heading>;
}

export function InsightsPage() {
  return (
    <Box>
      <Text color={COLORS.textMuted} fontSize="11px" fontWeight="600" letterSpacing="0.1em">ИНСАЙТЫ</Text>
      <Heading mb="16px" fontSize="24px">Инсайты безопасности</Heading>
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing="16px">
        <GlassCard p="20px"><SectionTitle>ТОП ИНДИКАТОРОВ КОМПРОМЕТАЦИИ</SectionTitle><VStack align="stretch">{iocs.slice(0, 10).map((ioc) => <Text key={ioc.id} fontFamily="mono" fontWeight="500" fontSize="13px" color={COLORS.info}>{formatHash(ioc.value, 10)} · {ioc.hits} срабатываний</Text>)}</VStack></GlassCard>
        <GlassCard p="20px"><SectionTitle>ПОДОЗРИТЕЛЬНЫЕ API-ПАТТЕРНЫ</SectionTitle><VStack align="stretch">{suspiciousApiPatterns.map((p) => <Box key={p.id} p="12px" border="1px solid" borderColor={COLORS.borderSubtle} borderRadius="md"><SeverityBadge severity={p.severity} /><Text mt="8px" fontWeight="500">{p.title}</Text><Text color={COLORS.textSecondary} fontSize="13px">{p.description}</Text><Text fontFamily="mono" fontWeight="500" fontSize="11px" color={COLORS.info}>{p.snippet}</Text></Box>)}</VStack></GlassCard>
        <GlassCard p="20px"><SectionTitle>РЕКОМЕНДАЦИИ ПО ЗАЩИТЕ</SectionTitle><VStack align="stretch">{recommendations.map((p) => <Box key={p.id}><SeverityBadge severity={p.severity} /><Text mt="8px" fontWeight="500">{p.title}</Text><Text color={COLORS.textSecondary} fontSize="13px">{p.description}</Text></Box>)}</VStack></GlassCard>
      </SimpleGrid>
    </Box>
  );
}
