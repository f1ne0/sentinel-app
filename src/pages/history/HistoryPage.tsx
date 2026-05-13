import { Box, Button, Checkbox, HStack, Input, Select, Skeleton, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { FiDownload, FiEye, FiTag, FiTrash2 } from 'react-icons/fi';
import { useAnalyses } from '../../entities/analysis/model/queries';
import { GlassCard } from '../../shared/ui/GlassCard';
import { EmptyState } from '../../shared/ui/EmptyState';
import { VerdictBadge } from '../../shared/ui/Badges';
import { COLORS, ROUTES } from '../../shared/constants';
import { formatBytes, formatDate, formatHash, translateSource } from '../../shared/utils';
import type { Severity, Verdict } from '../../shared/types';

export function HistoryPage() {
  const [search, setSearch] = useState('');
  const [verdict, setVerdict] = useState<Verdict | 'all'>('all');
  const [severity, setSeverity] = useState<Severity | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'risk' | 'filename'>('date');
  const [selected, setSelected] = useState<string[]>([]);
  const toast = useToast();
  const filters = useMemo(() => ({ search, verdicts: verdict === 'all' ? [] : [verdict], severity, sortBy }), [search, verdict, severity, sortBy]);
  const { data, isLoading } = useAnalyses(filters);
  const rows = data ?? [];
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const action = (title: string) => toast({ title, status: 'info', duration: 1600 });

  return (
    <VStack align="stretch" spacing="16px">
      <Box><Text color={COLORS.textMuted} fontSize="11px" fontWeight="600" letterSpacing="0.1em">АНАЛИЗ</Text><Text fontSize="24px" fontWeight="600">История анализа</Text></Box>
      <GlassCard p="20px">
        <HStack spacing="8px" wrap="wrap">
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск по имени файла или SHA-256" maxW="360px" />
          <Select value={verdict} onChange={(event) => setVerdict(event.target.value as Verdict | 'all')} maxW="170px">
            <option value="all">Все вердикты</option><option value="benign">Безопасный</option><option value="suspicious">Подозрительный</option><option value="malicious">Вредоносный</option>
          </Select>
          <Select value={severity} onChange={(event) => setSeverity(event.target.value as Severity | 'all')} maxW="170px">
            <option value="all">Любая критичность</option><option value="low">Низкая</option><option value="medium">Средняя</option><option value="high">Высокая</option><option value="critical">Критическая</option>
          </Select>
          <Select value={sortBy} onChange={(event) => setSortBy(event.target.value as 'date' | 'risk' | 'filename')} maxW="170px">
            <option value="date">Сортировка по дате</option><option value="risk">Сортировка по риску</option><option value="filename">Сортировка по имени</option>
          </Select>
        </HStack>
      </GlassCard>
      {selected.length > 0 && (
        <GlassCard p="20px"><HStack><Text fontWeight="500">Выбрано: {selected.length}</Text><Button size="sm" leftIcon={<FiDownload />} onClick={() => action('Экспорт поставлен в очередь')}>Экспорт</Button><Button size="sm" leftIcon={<FiTag />} onClick={() => action('Тег применён')}>Тег</Button><Button size="sm" leftIcon={<FiTrash2 />} onClick={() => action('Удаление смоделировано')}>Удалить</Button></HStack></GlassCard>
      )}
      <GlassCard overflowX="auto">
        {isLoading ? <Skeleton h="460px" startColor={COLORS.bgSurface} endColor={COLORS.bgElevated} /> : rows.length === 0 ? <EmptyState title="Анализы не найдены" description="Измените фильтры или выполните поиск по другому хэшу." /> : (
          <Table variant="unstyled" size="sm">
            <Thead><Tr color={COLORS.textMuted}><Th><Checkbox isChecked={selected.length === rows.length} onChange={() => setSelected(selected.length === rows.length ? [] : rows.map((row) => row.id))} /></Th><Th>Файл</Th><Th>Хэш</Th><Th>Вердикт</Th><Th>Риск</Th><Th>Семейство</Th><Th>Источник</Th><Th>Дата</Th><Th>Действия</Th></Tr></Thead>
            <Tbody>
              {rows.slice(0, 20).map((item, index) => (
                <Tr key={item.id} bg={index % 2 === 0 ? 'rgba(228,231,236,0.02)' : 'transparent'} _hover={{ bg: COLORS.bgElevated }}>
                  <Td><Checkbox isChecked={selected.includes(item.id)} onChange={() => toggle(item.id)} /></Td>
                  <Td><Text fontWeight="500">{item.fileName}</Text><Text color={COLORS.textMuted} fontSize="11px">{formatBytes(item.fileSize)}</Text></Td>
                  <Td fontFamily="mono" fontWeight="500" color={COLORS.info}>{formatHash(item.sha256)}</Td>
                  <Td><VerdictBadge verdict={item.verdict} /></Td>
                  <Td fontFamily="mono">{item.riskScore}</Td>
                  <Td>{item.malwareFamily}</Td>
                  <Td>{translateSource(item.source)}</Td>
                  <Td>{formatDate(item.createdAt)}</Td>
                  <Td position="sticky" right="0" bg="inherit"><Button as={Link} to={ROUTES.analysis(item.id)} size="sm" leftIcon={<FiEye />}>Открыть</Button></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </GlassCard>
    </VStack>
  );
}
