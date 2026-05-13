import { Badge, Box, Grid, GridItem, HStack, Heading, Progress, SimpleGrid, Skeleton, Text, VStack } from '@chakra-ui/react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import { FiActivity, FiArrowDownRight, FiArrowUpRight } from 'react-icons/fi';
import { useAnalyses } from '../../entities/analysis/model/queries';
import { GlassCard } from '../../shared/ui/GlassCard';
import { RiskRing } from '../../shared/ui/RiskRing';
import { Sparkline } from '../../shared/ui/Sparkline';
import { VerdictBadge } from '../../shared/ui/Badges';
import { alerts } from '../../shared/mock/alerts';
import { COLORS, ROUTES, VERDICT_COLORS } from '../../shared/constants';
import { formatDate, formatHash } from '../../shared/utils';
import { chartAxis, chartGrid, chartTooltipStyle } from '../../shared/ui/chartStyle';

const days = Array.from({ length: 30 }, (_, index) => ({
  day: index + 1,
  benign: 8 + (index % 6),
  suspicious: 3 + (index % 5),
  malicious: 2 + (index % 4),
}));
const innerRingData = [
  { name: 'классифицировано', value: 82 },
  { name: 'разрыв', value: 18 },
];

export function DashboardPage() {
  const { data, isLoading } = useAnalyses();
  const analyses = data ?? [];
  const risk = Math.round(analyses.reduce((sum, item) => sum + item.riskScore, 0) / Math.max(1, analyses.length));
  const verdictCounts = ['benign', 'suspicious', 'malicious'].map((verdict) => ({ name: verdict, value: analyses.filter((item) => item.verdict === verdict).length }));
  const familyData = Object.entries(analyses.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.malwareFamily]: (acc[item.malwareFamily] ?? 0) + 1 }), {})).map(([name, value]) => ({ name, value })).slice(0, 7);
  const iocData = analyses.flatMap((item) => item.iocs).slice(0, 7).map((ioc) => ({ name: formatHash(ioc.value, 5), hits: ioc.hits }));
  const kpis = [
    ['Всего анализов', analyses.length, COLORS.info, '+12%', true],
    ['Безопасные файлы', analyses.filter((item) => item.verdict === 'benign').length, COLORS.safe, '+6%', true],
    ['Подозрительные файлы', analyses.filter((item) => item.verdict === 'suspicious').length, COLORS.warning, '-4%', false],
    ['Вредоносные файлы', analyses.filter((item) => item.verdict === 'malicious').length, COLORS.critical, '+9%', true],
    ['Средний риск', risk, COLORS.ai, '+3%', true],
  ] as const;

  if (isLoading) return <Skeleton h="70vh" borderRadius="lg" startColor={COLORS.bgSurface} endColor={COLORS.bgElevated} />;

  return (
    <Grid templateColumns={{ base: '1fr', '2xl': '1fr 360px' }} gap="16px">
      <GridItem>
        <VStack align="stretch" spacing="16px">
          <GlassCard p="24px" minH="188px">
            <HStack justify="space-between" align="start">
              <Box>
                <Text color={COLORS.textMuted} fontSize="11px" fontWeight="600" letterSpacing="0.1em">СОСТОЯНИЕ УГРОЗ</Text>
                <HStack align="baseline" spacing="12px" mt="8px">
                  <Text fontFamily="'Instrument Serif', serif" fontStyle="italic" fontSize={{ base: '40px', xl: '48px' }} lineHeight="1.1">{risk}</Text>
                  <Badge h="22px" px="8px" borderRadius="md" bg="rgba(255,167,38,0.08)" color={COLORS.warning} border="1px solid rgba(255,167,38,0.45)" fontSize="11px" fontWeight="600" letterSpacing="0.06em">ПОВЫШЕННЫЙ</Badge>
                </HStack>
                <Text color={COLORS.textSecondary} maxW="740px" fontSize="14px">Статические и динамические признаки показывают повышенную активность загрузчиков и C2 в последних sandbox-запусках.</Text>
              </Box>
              <RiskRing value={risk} size={112} />
            </HStack>
            <Progress mt="20px" value={risk} h="4px" borderRadius="sm" bg={COLORS.borderSubtle} sx={{ '& > div': { bg: 'linear-gradient(90deg, #10B981, #FFA726, #FF4757)' } }} />
          </GlassCard>

          <SimpleGrid columns={{ base: 1, md: 2, xl: 5 }} spacing="16px">
            {kpis.map(([label, value, color, trend, positive]) => (
              <GlassCard key={label} p="20px">
                <Text color={COLORS.textMuted} fontSize="11px" fontWeight="600" letterSpacing="0.08em" textTransform="uppercase">{label}</Text>
                <HStack mt="8px" align="baseline" justify="space-between">
                  <Text fontFamily="mono" fontSize="32px" lineHeight="1.1" fontWeight="500">{value}</Text>
                  <HStack spacing="4px" color={positive ? COLORS.safe : COLORS.critical}>
                    {positive ? <FiArrowUpRight size={13} /> : <FiArrowDownRight size={13} />}
                    <Text fontFamily="mono" fontSize="11px" fontWeight="500">{trend}</Text>
                  </HStack>
                </HStack>
                <Sparkline data={[12, 18, 15, 24, 19, 28, Number(value) % 30 + 12]} color={String(color)} />
              </GlassCard>
            ))}
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, xl: 2 }} spacing="16px">
            <GlassCard p="20px" minH="350px">
              <HStack justify="space-between" mb="12px">
                <Box>
                  <Heading size="xs" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">АНАЛИЗЫ ПО ДНЯМ</Heading>
                  <Text color={COLORS.textSecondary} fontSize="13px">Ежедневные sandbox-запуски по вердиктам за последние 30 дней.</Text>
                </Box>
                <HStack spacing="12px">
                  {(['benign', 'suspicious', 'malicious'] as const).map((verdict) => <HStack key={verdict} spacing="6px"><Box w="8px" h="8px" borderRadius="sm" bg={VERDICT_COLORS[verdict]} /><Text fontSize="11px" color={COLORS.textSecondary}>{verdict === 'benign' ? 'безопасные' : verdict === 'suspicious' ? 'подозрительные' : 'вредоносные'}</Text></HStack>)}
                </HStack>
              </HStack>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={days} margin={{ top: 12, right: 16, bottom: 0, left: -12 }}>
                  <CartesianGrid {...chartGrid} />
                  <XAxis dataKey="day" {...chartAxis} />
                  <YAxis {...chartAxis} />
                  <Tooltip contentStyle={chartTooltipStyle} cursor={{ stroke: COLORS.borderStrong }} />
                  <Area type="monotone" dataKey="benign" stackId="1" stroke={COLORS.safe} strokeWidth={1.5} fill="rgba(16,185,129,0.09)" />
                  <Area type="monotone" dataKey="suspicious" stackId="1" stroke={COLORS.warning} strokeWidth={1.5} fill="rgba(255,167,38,0.09)" />
                  <Area type="monotone" dataKey="malicious" stackId="1" stroke={COLORS.critical} strokeWidth={1.5} fill="rgba(255,71,87,0.09)" />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
            <GlassCard p="20px" minH="350px">
              <HStack justify="space-between" mb="12px" align="start">
                <Box>
                  <Heading size="xs" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">РАСПРЕДЕЛЕНИЕ ВЕРДИКТОВ</Heading>
                  <Text color={COLORS.textSecondary} fontSize="13px">Доля файлов по итоговой классификации.</Text>
                </Box>
                <VStack align="end" spacing="4px">
                  {verdictCounts.map((item) => <HStack key={item.name} spacing="6px"><Box w="8px" h="8px" borderRadius="sm" bg={VERDICT_COLORS[item.name as keyof typeof VERDICT_COLORS]} /><Text fontFamily="mono" fontSize="11px" color={COLORS.textSecondary}>{item.name === 'benign' ? 'безопасные' : item.name === 'suspicious' ? 'подозрительные' : 'вредоносные'}: {item.value}</Text></HStack>)}
                </VStack>
              </HStack>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={verdictCounts} dataKey="value" innerRadius={66} outerRadius={100} startAngle={90} endAngle={-270} paddingAngle={5} cornerRadius={12} stroke="none">
                    {verdictCounts.map((item) => <Cell key={item.name} fill={VERDICT_COLORS[item.name as keyof typeof VERDICT_COLORS]} />)}
                    <Label value={`${analyses.length} файлов`} position="center" fill={COLORS.textPrimary} fontSize={13} fontFamily="JetBrains Mono" fontWeight={500} />
                  </Pie>
                  <Pie data={innerRingData} dataKey="value" innerRadius={42} outerRadius={56} startAngle={90} endAngle={-270} paddingAngle={2} cornerRadius={10} stroke="none">
                    <Cell fill="rgba(6,182,212,0.72)" />
                    <Cell fill="transparent" />
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>
            <GlassCard p="20px" minH="320px">
              <Box mb="12px">
                <Heading size="xs" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">ТОП СЕМЕЙСТВ ВПО</Heading>
                <Text color={COLORS.textSecondary} fontSize="13px">Самые частые семейства в последних анализах.</Text>
              </Box>
              <ResponsiveContainer width="100%" height={220}><BarChart data={familyData} margin={{ top: 12, right: 12, bottom: 0, left: -12 }}><CartesianGrid {...chartGrid} /><XAxis dataKey="name" {...chartAxis} /><YAxis {...chartAxis} /><Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(21,24,31,0.55)' }} /><Bar dataKey="value" fill="rgba(167,139,250,0.82)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
            </GlassCard>
            <GlassCard p="20px" minH="320px">
              <Box mb="12px">
                <Heading size="xs" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">ТОП ПОДОЗРИТЕЛЬНЫХ IOC</Heading>
                <Text color={COLORS.textSecondary} fontSize="13px">Частота IOC среди извлечённых mock-индикаторов.</Text>
              </Box>
              <ResponsiveContainer width="100%" height={220}><BarChart data={iocData} layout="vertical" margin={{ top: 12, right: 16, bottom: 0, left: 8 }}><CartesianGrid {...chartGrid} /><XAxis type="number" {...chartAxis} /><YAxis type="category" dataKey="name" {...chartAxis} width={92} /><Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(21,24,31,0.55)' }} /><Bar dataKey="hits" fill="rgba(6,182,212,0.78)" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer>
            </GlassCard>
          </SimpleGrid>

          <GlassCard p="20px">
            <Heading size="xs" mb="12px" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">ПОСЛЕДНИЕ АНАЛИЗЫ</Heading>
            <VStack align="stretch" spacing="8px">
              {analyses.slice(0, 5).map((item) => (
                <HStack as={Link} to={ROUTES.analysis(item.id)} key={item.id} justify="space-between" minH="48px" px="12px" borderRadius="md" _hover={{ bg: COLORS.bgElevated }}>
                  <Box><Text fontWeight="500">{item.fileName}</Text><Text fontFamily="mono" color={COLORS.info} fontSize="11px" fontWeight="500">{formatHash(item.sha256)}</Text></Box>
                  <VerdictBadge verdict={item.verdict} />
                  <Text fontFamily="mono" fontWeight="500">{item.riskScore}</Text>
                </HStack>
              ))}
            </VStack>
          </GlassCard>
        </VStack>
      </GridItem>
      <GridItem>
        <GlassCard p="20px" position="sticky" top="24px" maxH="calc(100vh - 48px)" overflowY="auto">
          <HStack mb="16px">
            <Box w="6px" h="6px" borderRadius="full" bg={COLORS.safe} animation="pulse 2s infinite" />
            <Heading size="xs" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">LIVE-СИГНАЛЫ УГРОЗ</Heading>
            <FiActivity color={COLORS.textMuted} size={13} />
          </HStack>
          <VStack align="stretch" spacing="10px">
            {alerts.map((alert) => (
              <Box key={alert.id} p="12px" border="1px solid" borderColor={COLORS.borderSubtle} borderRadius="md">
                <HStack justify="space-between"><Text fontWeight="500">{alert.title}</Text><Text color={COLORS.textMuted} fontFamily="mono" fontSize="11px">{formatDate(alert.timestamp)}</Text></HStack>
                <Text color={COLORS.textSecondary} fontSize="13px">{alert.description}</Text>
              </Box>
            ))}
          </VStack>
        </GlassCard>
      </GridItem>
    </Grid>
  );
}
