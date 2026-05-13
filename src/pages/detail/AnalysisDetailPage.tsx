import { Box, Button, Grid, HStack, Heading, Progress, SimpleGrid, Skeleton, Tab, TabList, TabPanel, TabPanels, Tabs, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { FiCopy, FiDownload, FiRefreshCw, FiShare2, FiStar } from 'react-icons/fi';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAnalysisById } from '../../entities/analysis/model/queries';
import { GlassCard } from '../../shared/ui/GlassCard';
import { RiskRing } from '../../shared/ui/RiskRing';
import { SeverityBadge, VerdictBadge } from '../../shared/ui/Badges';
import { COLORS } from '../../shared/constants';
import { formatBytes, formatDate, translateSource } from '../../shared/utils';
import type { ProcessNode } from '../../shared/types';
import { chartAxis, chartGrid, chartTooltipStyle } from '../../shared/ui/chartStyle';

function ProcessTree({ node }: { node: ProcessNode }) {
  return (
    <Box pl="12px" borderLeft="1px solid" borderColor={COLORS.borderStrong}>
      <Text fontFamily="mono" fontWeight="500">{node.name} <Text as="span" color={COLORS.textMuted}>PID {node.pid}</Text></Text>
      <Text color={COLORS.textSecondary} fontSize="13px">{node.commandLine}</Text>
      <VStack align="stretch" mt="8px">{node.children.map((child) => <ProcessTree key={child.id} node={child} />)}</VStack>
    </Box>
  );
}

export function AnalysisDetailPage() {
  const { id = '' } = useParams();
  const { data, isLoading, error } = useAnalysisById(id);
  const toast = useToast();
  const copy = (value: string) => {
    void navigator.clipboard.writeText(value);
    toast({ title: 'Скопировано в буфер обмена', status: 'success', duration: 1200 });
  };

  if (isLoading) return <Skeleton h="75vh" borderRadius="lg" startColor={COLORS.bgSurface} endColor={COLORS.bgElevated} />;
  if (error || !data) return <GlassCard p="24px"><Heading size="md">Анализ не найден</Heading></GlassCard>;

  return (
    <VStack align="stretch" spacing="16px">
      <HStack justify="space-between" align="start">
        <Box><Text color={COLORS.textMuted} fontSize="11px" fontWeight="600" letterSpacing="0.1em">АНАЛИЗ / {data.id}</Text><Heading fontSize="24px">{data.fileName}</Heading><Text fontFamily="mono" fontWeight="500" fontSize="13px" color={COLORS.info}>{data.sha256}</Text></Box>
        <HStack className="no-print"><Button leftIcon={<FiRefreshCw />}>Повторить анализ</Button><Button leftIcon={<FiDownload />} onClick={() => window.print()}>Экспорт PDF</Button><Button leftIcon={<FiShare2 />}>Поделиться</Button><Button leftIcon={<FiStar />}>В watchlist</Button></HStack>
      </HStack>
      <Tabs colorScheme="cyan" variant="enclosed">
        <TabList className="no-print" borderColor={COLORS.borderStrong} flexWrap="wrap">
          {['Обзор', 'Статический анализ', 'Динамический анализ', 'MITRE ATT&CK', 'YARA-срабатывания', 'IOC'].map((tab) => <Tab key={tab}>{tab}</Tab>)}
        </TabList>
        <TabPanels>
          <TabPanel px="0">
            <Grid templateColumns={{ base: '1fr', xl: '1.2fr 0.8fr' }} gap="16px">
              <GlassCard p="20px">
                <Heading size="xs" mb="12px" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">ОБЩАЯ ИНФОРМАЦИЯ</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing="12px">
                  {[
                    ['Имя файла', data.fileName], ['Размер', formatBytes(data.fileSize)], ['MD5', data.md5], ['SHA1', data.sha1], ['SHA256', data.sha256], ['IMPHASH', data.imphash], ['MIME type', data.mimeType], ['Тип файла', data.fileType], ['Подпись', data.signedBy ?? 'Без подписи'], ['Время компиляции', formatDate(data.compileTimestamp)], ['Источник загрузки', translateSource(data.source)], ['Аналитик', data.analyst],
                  ].map(([label, value]) => <Box key={label}><Text color={COLORS.textMuted} fontSize="11px" letterSpacing="0.08em" textTransform="uppercase">{label}</Text><Text fontFamily={String(value).length > 20 ? 'mono' : 'body'} fontWeight={String(value).length > 20 ? '500' : '400'} fontSize="13px" color={String(value).length > 20 ? COLORS.info : COLORS.textPrimary} onClick={() => copy(String(value))} cursor="copy">{value}</Text></Box>)}
                </SimpleGrid>
              </GlassCard>
              <GlassCard p="20px">
                <HStack justify="space-between"><Box><Heading size="xs" mb="12px" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">ВЕРДИКТ</Heading><VerdictBadge verdict={data.verdict} /></Box><RiskRing value={data.riskScore} size={112} /></HStack>
                <Text mt="12px" color={COLORS.textSecondary} fontSize="13px">{data.explanation}</Text>
                <Text mt="12px">Уверенность <Text as="span" fontFamily="mono">{data.confidence}%</Text></Text>
                <Progress value={data.confidence} mt="6px" h="6px" colorScheme="cyan" />
              </GlassCard>
              <GlassCard p="20px" gridColumn={{ xl: '1 / -1' }}>
                <Heading size="xs" mb="12px" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">ML-ОБЪЯСНЕНИЕ</Heading>
                <VStack align="stretch">{data.topFeatures.map((feature) => <Box key={feature.name}><HStack justify="space-between"><Text>{feature.name}</Text><Text fontFamily="mono">{feature.importance}%</Text></HStack><Progress value={feature.importance} h="6px" colorScheme="purple" /></Box>)}</VStack>
              </GlassCard>
            </Grid>
          </TabPanel>
          <TabPanel px="0">
            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing="16px">
              <GlassCard p="20px"><Heading size="xs" mb="12px" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">ГИСТОГРАММА ЭНТРОПИИ</Heading><ResponsiveContainer width="100%" height={240}><BarChart data={data.staticFeatures.peSections} margin={{ top: 12, right: 16, bottom: 0, left: -12 }}><CartesianGrid {...chartGrid} /><XAxis dataKey="name" {...chartAxis} /><YAxis {...chartAxis} /><Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(21,24,31,0.55)' }} /><Bar dataKey="entropy" fill="rgba(255,167,38,0.78)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></GlassCard>
              <GlassCard p="20px"><Heading size="xs" mb="12px" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">ПОДОЗРИТЕЛЬНЫЕ API</Heading><VStack align="stretch">{data.staticFeatures.suspiciousApis.map((api) => <Box key={api} p="12px" border="1px solid" borderColor={COLORS.borderSubtle} borderRadius="md"><Text fontFamily="mono" fontWeight="500">{api}</Text><Text color={COLORS.textSecondary} fontSize="13px">Связано с injection, persistence, execution или network staging поведением.</Text></Box>)}</VStack></GlassCard>
              <GlassCard p="20px" gridColumn={{ xl: '1 / -1' }} overflowX="auto"><Heading size="xs" mb="12px" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">PE-СЕКЦИИ</Heading><Table size="sm" variant="unstyled"><Thead><Tr><Th>Имя</Th><Th>Virtual</Th><Th>Raw</Th><Th>Энтропия</Th><Th>Характеристики</Th><Th>Флаг</Th></Tr></Thead><Tbody>{data.staticFeatures.peSections.map((section) => <Tr key={section.name}><Td fontFamily="mono">{section.name}</Td><Td>{section.virtualSize}</Td><Td>{section.rawSize}</Td><Td>{section.entropy}</Td><Td>{section.characteristics}</Td><Td>{section.suspicious ? <SeverityBadge severity="high" /> : <SeverityBadge severity="low" />}</Td></Tr>)}</Tbody></Table></GlassCard>
              <GlassCard p="20px"><Heading size="xs" mb="12px" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">ИМПОРТИРОВАННЫЕ БИБЛИОТЕКИ</Heading><Text fontFamily="mono" fontWeight="500" color={COLORS.info}>{data.staticFeatures.importedLibraries.join(' · ')}</Text></GlassCard>
              <GlassCard p="20px"><Heading size="xs" mb="12px" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">ПРОСМОТР СТРОК</Heading><VStack align="stretch">{[...data.staticFeatures.suspiciousStrings, ...data.staticFeatures.suspiciousUrls].map((value) => <HStack key={value} justify="space-between"><Text fontFamily="mono" fontWeight="500" color={COLORS.info}>{value}</Text><Button size="sm" leftIcon={<FiCopy />} onClick={() => copy(value)}>Копировать</Button></HStack>)}</VStack></GlassCard>
            </SimpleGrid>
          </TabPanel>
          <TabPanel px="0">
            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing="16px">
              <GlassCard p="20px"><Heading size="xs" mb="12px" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">SANDBOX-ТАЙМЛАЙН</Heading><VStack align="stretch">{data.dynamicFeatures.timeline.map((event) => <Box key={event.id} p="12px" borderLeft="1px solid" borderColor={COLORS.info}><HStack justify="space-between"><Text fontWeight="500">{event.timestamp} · {event.title}</Text><SeverityBadge severity={event.severity} /></HStack><Text color={COLORS.textSecondary} fontSize="13px">{event.detail}</Text></Box>)}</VStack></GlassCard>
              <GlassCard p="20px"><Heading size="xs" mb="12px" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">ДЕРЕВО ПРОЦЕССОВ</Heading><ProcessTree node={data.dynamicFeatures.processTree} /></GlassCard>
              <GlassCard p="20px"><Heading size="xs" mb="12px" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">СЕТЕВАЯ АКТИВНОСТЬ</Heading><Table size="sm" variant="unstyled"><Tbody>{data.iocs.filter((ioc) => ioc.type === 'ip' || ioc.type === 'domain' || ioc.type === 'url').map((ioc) => <Tr key={ioc.id}><Td fontFamily="mono" fontWeight="500" color={COLORS.info}>{ioc.value}</Td><Td>{ioc.type}</Td><Td><SeverityBadge severity={ioc.severity} /></Td></Tr>)}</Tbody></Table></GlassCard>
              <GlassCard p="20px"><Heading size="xs" mb="12px" color={COLORS.textMuted} fontSize="11px" letterSpacing="0.1em">СЕТЕВОЙ ГРАФ</Heading><svg viewBox="0 0 420 220" width="100%" height="220"><line x1="90" y1="110" x2="210" y2="60" stroke={COLORS.info} /><line x1="90" y1="110" x2="250" y2="150" stroke={COLORS.warning} /><line x1="250" y1="150" x2="350" y2="92" stroke={COLORS.critical} /><circle cx="90" cy="110" r="28" fill={COLORS.bgSurface} stroke={COLORS.info} /><circle cx="210" cy="60" r="22" fill={COLORS.bgSurface} stroke={COLORS.warning} /><circle cx="250" cy="150" r="22" fill={COLORS.bgSurface} stroke={COLORS.info} /><circle cx="350" cy="92" r="24" fill={COLORS.bgSurface} stroke={COLORS.critical} /><text x="62" y="116" fill={COLORS.textPrimary} fontSize="12">host</text><text x="185" y="65" fill={COLORS.textPrimary} fontSize="12">dns</text><text x="224" y="155" fill={COLORS.textPrimary} fontSize="12">c2</text><text x="326" y="97" fill={COLORS.textPrimary} fontSize="12">stage</text></svg></GlassCard>
            </SimpleGrid>
          </TabPanel>
          <TabPanel px="0"><SimpleGrid columns={{ base: 1, xl: 2 }} spacing="16px">{data.mitreAttacks.map((technique) => <GlassCard key={technique.id} p="20px"><HStack justify="space-between"><Heading size="sm" fontFamily="mono" color={COLORS.info}>{technique.id}</Heading><Text color={COLORS.textMuted} fontSize="13px">{technique.tactic}</Text></HStack><Text fontWeight="500">{technique.name}</Text><Text color={COLORS.textSecondary} fontSize="13px">{technique.description}</Text></GlassCard>)}</SimpleGrid></TabPanel>
          <TabPanel px="0"><VStack align="stretch">{data.yaraMatches.map((rule) => <GlassCard key={rule.name} p="20px"><HStack justify="space-between"><Heading size="sm">{rule.name}</Heading><Text color={COLORS.textSecondary}>{rule.author}</Text></HStack><Text>{rule.description}</Text>{rule.matchedStrings.map((match) => <Text key={match.offset} fontFamily="mono" fontWeight="500" color={COLORS.warning}>{match.offset} · {match.value}</Text>)}</GlassCard>)}</VStack></TabPanel>
          <TabPanel px="0"><GlassCard overflowX="auto"><Table size="sm" variant="unstyled"><Thead><Tr><Th>Тип</Th><Th>Значение</Th><Th>Срабатывания</Th><Th>Критичность</Th><Th>Копировать</Th></Tr></Thead><Tbody>{data.iocs.map((ioc) => <Tr key={ioc.id}><Td>{ioc.type}</Td><Td fontFamily="mono">{ioc.value}</Td><Td>{ioc.hits}</Td><Td><SeverityBadge severity={ioc.severity} /></Td><Td><Button size="xs" onClick={() => copy(ioc.value)}>Копировать</Button></Td></Tr>)}</Tbody></Table></GlassCard></TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}
