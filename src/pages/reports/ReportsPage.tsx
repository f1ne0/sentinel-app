import { Box, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, Treemap, XAxis, YAxis } from 'recharts';
import { GlassCard } from '../../shared/ui/GlassCard';
import { analyses } from '../../shared/mock/analyses';
import { COLORS, VERDICT_COLORS } from '../../shared/constants';
import { chartAxis, chartGrid, chartTooltipStyle } from '../../shared/ui/chartStyle';

const trend = Array.from({ length: 30 }, (_, i) => ({ day: i + 1, risk: 38 + ((i * 7) % 41), malicious: 2 + (i % 7), suspicious: 4 + (i % 5) }));
const verdicts = ['benign', 'suspicious', 'malicious'].map((v) => ({ name: v, value: analyses.filter((a) => a.verdict === v).length }));
const families = Object.entries(analyses.reduce<Record<string, number>>((acc, a) => ({ ...acc, [a.malwareFamily]: (acc[a.malwareFamily] ?? 0) + 1 }), {})).map(([name, size]) => ({ name, size }));
const bars = ['exe', 'dll', 'ps1', 'docm', 'lnk', 'msi'].map((name, i) => ({ name, value: 12 + i * 5 }));
const innerRingData = [
  { name: 'классифицировано', value: 82 },
  { name: 'разрыв', value: 18 },
];
function ChartTitle({ title, description }: { title: string; description: string }) {
  return (
    <Box mb="12px">
      <Heading size="xs" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">{title}</Heading>
      <Text color={COLORS.textSecondary} fontSize="13px">{description}</Text>
    </Box>
  );
}

function ChartArea({ children, height = 220 }: { children: React.ReactNode; height?: number }) {
  return (
    <Box h={`${height}px`} minH={`${height}px`}>
      {children}
    </Box>
  );
}

interface TreemapNodeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  depth?: number;
}

function TreemapTile({ x = 0, y = 0, width = 0, height = 0, name = '', depth = 0 }: TreemapNodeProps) {
  if (depth === 0) return null;
  const showLabel = width > 82 && height > 42;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="rgba(167,139,250,0.78)" stroke={COLORS.bgBase} strokeWidth={1} />
      {showLabel && (
        <text x={x + 12} y={y + Math.min(height / 2 + 4, 28)} fill="#090A0E" fontFamily="Manrope" fontWeight={600} fontSize={13}>
          {name}
        </text>
      )}
    </g>
  );
}

export function ReportsPage() {
  return (
    <Box>
      <Text color={COLORS.textMuted} fontSize="11px" fontWeight="600" letterSpacing="0.1em">РАЗВЕДКА</Text>
      <Heading mb="16px" fontSize="24px">Отчёты об угрозах</Heading>
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing="16px">
        <GlassCard p="20px" h="330px"><HStack justify="space-between" align="start"><ChartTitle title="РАСПРЕДЕЛЕНИЕ ТИПОВ УГРОЗ" description="Количество образцов по вердиктам." /><VStack align="end" spacing="4px">{verdicts.map((v) => <HStack key={v.name} spacing="6px"><Box w="8px" h="8px" borderRadius="sm" bg={VERDICT_COLORS[v.name as keyof typeof VERDICT_COLORS]} /><Text fontFamily="mono" fontSize="11px" color={COLORS.textSecondary}>{v.name === 'benign' ? 'безопасные' : v.name === 'suspicious' ? 'подозрительные' : 'вредоносные'}: {v.value}</Text></HStack>)}</VStack></HStack><ChartArea height={212}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={verdicts} dataKey="value" innerRadius={62} outerRadius={96} startAngle={90} endAngle={-270} paddingAngle={5} cornerRadius={12} stroke="none">{verdicts.map((v) => <Cell key={v.name} fill={VERDICT_COLORS[v.name as keyof typeof VERDICT_COLORS]} />)}<Label value={`${analyses.length} файлов`} position="center" fill={COLORS.textPrimary} fontSize={13} fontFamily="JetBrains Mono" fontWeight={500} /></Pie><Pie data={innerRingData} dataKey="value" innerRadius={40} outerRadius={54} startAngle={90} endAngle={-270} paddingAngle={2} cornerRadius={10} stroke="none"><Cell fill="rgba(6,182,212,0.72)" /><Cell fill="transparent" /></Pie><Tooltip contentStyle={chartTooltipStyle} /></PieChart></ResponsiveContainer></ChartArea></GlassCard>
        <GlassCard p="20px" h="330px"><ChartTitle title="ТРЕНД ОЦЕНКИ РИСКА" description="Средний risk score за последние 30 дней." /><ChartArea><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{ top: 12, right: 16, bottom: 0, left: -12 }}><CartesianGrid {...chartGrid} /><XAxis dataKey="day" {...chartAxis} /><YAxis {...chartAxis} domain={[0, 100]} /><Tooltip contentStyle={chartTooltipStyle} cursor={{ stroke: COLORS.borderStrong }} /><Area type="monotone" dataKey="risk" name="Оценка риска" stroke={COLORS.warning} strokeWidth={1.5} fill="rgba(255,167,38,0.10)" /></AreaChart></ResponsiveContainer></ChartArea></GlassCard>
        <GlassCard p="20px" h="330px"><HStack justify="space-between" align="start"><ChartTitle title="СТАТИЧЕСКИЙ / ДИНАМИЧЕСКИЙ АНАЛИЗ" description="Покрытие детектирования по источникам признаков." /><VStack align="end" spacing="4px"><Text fontFamily="mono" fontSize="11px" color={COLORS.info}>статический 74%</Text><Text fontFamily="mono" fontSize="11px" color={COLORS.ai}>динамический 61%</Text></VStack></HStack><ChartArea height={212}><ResponsiveContainer width="100%" height="100%"><RadialBarChart innerRadius="42%" outerRadius="92%" data={[{ name: 'статический', value: 74, fill: 'rgba(6,182,212,0.78)' }, { name: 'динамический', value: 61, fill: 'rgba(167,139,250,0.78)' }]} startAngle={90} endAngle={-270}><RadialBar dataKey="value" background={{ fill: 'rgba(255,255,255,0.04)' }} cornerRadius={10} /></RadialBarChart></ResponsiveContainer></ChartArea></GlassCard>
        <GlassCard p="20px" h="330px"><ChartTitle title="РАСПРЕДЕЛЕНИЕ СЕМЕЙСТВ ВПО" description="Площадь блока равна числу образцов семейства." /><ChartArea><ResponsiveContainer width="100%" height="100%"><Treemap data={families} dataKey="size" aspectRatio={4 / 3} content={<TreemapTile />} /></ResponsiveContainer></ChartArea></GlassCard>
        <GlassCard p="20px" h="330px"><ChartTitle title="ТЕПЛОВАЯ КАРТА ПОВЕДЕНИЯ" description="Чем темнее ячейка, тем больше подозрительных событий." /><SimpleGrid columns={7} spacing="6px" mt="14px">{Array.from({ length: 42 }, (_, i) => <Box key={i} h="32px" bg={`rgba(255,71,87,${0.04 + (i % 7) * 0.035})`} border="1px solid" borderColor={COLORS.borderSubtle} borderRadius="sm" />)}</SimpleGrid></GlassCard>
        <GlassCard p="20px" h="330px"><HStack justify="space-between" align="start"><ChartTitle title="НЕДЕЛЬНЫЙ ОТЧЁТ ПО УГРОЗАМ" description="Суммарное число вредоносных и подозрительных образцов." /><HStack spacing="12px"><HStack spacing="6px"><Box w="8px" h="8px" bg={COLORS.critical} /><Text fontSize="11px" color={COLORS.textSecondary}>вредоносные</Text></HStack><HStack spacing="6px"><Box w="8px" h="8px" bg={COLORS.warning} /><Text fontSize="11px" color={COLORS.textSecondary}>подозрительные</Text></HStack></HStack></HStack><ChartArea height={212}><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend.slice(0, 14)} margin={{ top: 12, right: 16, bottom: 0, left: -12 }}><CartesianGrid {...chartGrid} /><XAxis dataKey="day" {...chartAxis} /><YAxis {...chartAxis} /><Tooltip contentStyle={chartTooltipStyle} cursor={{ stroke: COLORS.borderStrong }} /><Area type="monotone" dataKey="malicious" stackId="1" fill="rgba(255,71,87,0.11)" stroke={COLORS.critical} strokeWidth={1.5} /><Area type="monotone" dataKey="suspicious" stackId="1" fill="rgba(255,167,38,0.09)" stroke={COLORS.warning} strokeWidth={1.5} /></AreaChart></ResponsiveContainer></ChartArea></GlassCard>
        <GlassCard p="20px" h="330px"><ChartTitle title="ЦЕЛЕВЫЕ ТИПЫ ФАЙЛОВ" description="Количество подозрительных образцов по расширениям." /><ChartArea><ResponsiveContainer width="100%" height="100%"><BarChart data={bars} layout="vertical" margin={{ top: 12, right: 16, bottom: 0, left: 8 }}><CartesianGrid {...chartGrid} /><XAxis type="number" {...chartAxis} /><YAxis dataKey="name" type="category" {...chartAxis} /><Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(21,24,31,0.55)' }} /><Bar dataKey="value" name="Образцы" fill="rgba(6,182,212,0.78)" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></ChartArea></GlassCard>
        <GlassCard p="20px" h="330px"><ChartTitle title="ГЕОГРАФИЯ ИСТОЧНИКОВ УГРОЗ" description="Относительная уверенность по mock threat intel." /><VStack align="stretch" spacing="0" mt="8px">{['US', 'DE', 'SG', 'NL', 'JP', 'BR'].map((c, i) => <HStack key={c} h="36px" borderBottom={i === 5 ? '0' : '1px solid'} borderColor={COLORS.borderSubtle} spacing="16px"><Text w="44px" fontFamily="mono" fontWeight="500">{c}</Text><Box flex="1" h="6px" bg={COLORS.borderSubtle} borderRadius="sm"><Box h="6px" w={`${88 - i * 10}%`} bg={COLORS.warning} borderRadius="sm" /></Box><Text w="48px" fontFamily="mono" textAlign="right">{88 - i * 10}%</Text></HStack>)}</VStack></GlassCard>
      </SimpleGrid>
    </Box>
  );
}
