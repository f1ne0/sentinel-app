import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, HStack, Heading, Input, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { fetchIOCs } from '../../shared/lib/api';
import { queryKeys } from '../../shared/lib/queryKeys';
import { GlassCard } from '../../shared/ui/GlassCard';
import { SeverityBadge } from '../../shared/ui/Badges';
import { COLORS } from '../../shared/constants';
import { formatDate } from '../../shared/utils';
import type { IOC, IocType, Severity } from '../../shared/types';

export function IndicatorsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<IocType | 'all'>('all');
  const [severity, setSeverity] = useState<Severity | 'all'>('all');
  const [active, setActive] = useState<IOC | null>(null);
  const drawer = useDisclosure();
  const filters = useMemo(() => ({ search, type, severity }), [search, type, severity]);
  const { data = [] } = useQuery({ queryKey: [...queryKeys.iocs, filters], queryFn: () => fetchIOCs(filters) });
  const open = (ioc: IOC) => { setActive(ioc); drawer.onOpen(); };
  return (
    <Box><Text color={COLORS.textMuted} fontSize="11px" fontWeight="600" letterSpacing="0.1em">РАЗВЕДКА</Text><Heading mb="16px" fontSize="24px">База IOC</Heading>
      <GlassCard p="20px" mb="16px"><HStack wrap="wrap" spacing="8px"><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по значению IOC" maxW="360px" /><Select value={type} onChange={(e) => setType(e.target.value as IocType | 'all')} maxW="160px"><option value="all">Все типы</option><option value="hash">Hash</option><option value="url">URL</option><option value="ip">IP</option><option value="domain">Domain</option><option value="mutex">Mutex</option></Select><Select value={severity} onChange={(e) => setSeverity(e.target.value as Severity | 'all')} maxW="170px"><option value="all">Любая критичность</option><option value="low">Низкая</option><option value="medium">Средняя</option><option value="high">Высокая</option><option value="critical">Критическая</option></Select></HStack></GlassCard>
      <GlassCard overflowX="auto"><Table size="sm" variant="unstyled"><Thead><Tr><Th>Тип</Th><Th>Значение</Th><Th>Первое появление</Th><Th>Последнее появление</Th><Th>Срабатывания</Th><Th>Критичность</Th><Th>Источник</Th></Tr></Thead><Tbody>{data.map((ioc, index) => <Tr key={ioc.id} onClick={() => open(ioc)} cursor="pointer" bg={index % 2 === 0 ? 'rgba(228,231,236,0.02)' : 'transparent'} _hover={{ bg: COLORS.bgElevated }}><Td>{ioc.type}</Td><Td fontFamily="mono" fontWeight="500" color={COLORS.info}>{ioc.value}</Td><Td>{formatDate(ioc.firstSeen)}</Td><Td>{formatDate(ioc.lastSeen)}</Td><Td>{ioc.hits}</Td><Td><SeverityBadge severity={ioc.severity} /></Td><Td>{ioc.source}</Td></Tr>)}</Tbody></Table></GlassCard>
      <Drawer isOpen={drawer.isOpen} onClose={drawer.onClose} placement="right"><DrawerOverlay /><DrawerContent bg={COLORS.bgElevated}><DrawerHeader>Детали IOC</DrawerHeader><DrawerBody>{active && <Box><Text fontFamily="mono" mb="12px">{active.value}</Text><SeverityBadge severity={active.severity} /><Text mt="14px">Связанные анализы: {active.relatedAnalysisIds.join(', ')}</Text><Text>Threat actors: {active.threatActors.join(', ')}</Text><Text>Семейства: {active.malwareFamilies.join(', ')}</Text><Button mt="16px" onClick={drawer.onClose}>Закрыть</Button></Box>}</DrawerBody></DrawerContent></Drawer>
    </Box>
  );
}
