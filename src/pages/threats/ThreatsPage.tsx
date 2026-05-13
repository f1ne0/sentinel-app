import { Box, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchThreatFeed } from '../../shared/lib/api';
import { queryKeys } from '../../shared/lib/queryKeys';
import { GlassCard } from '../../shared/ui/GlassCard';
import { SeverityBadge } from '../../shared/ui/Badges';
import { COLORS } from '../../shared/constants';
import { formatDate } from '../../shared/utils';
import type { ThreatFeedItem } from '../../shared/types';

export function ThreatsPage() {
  const { data = [] } = useQuery({ queryKey: queryKeys.threatFeed, queryFn: fetchThreatFeed });
  const [liveItems, setLiveItems] = useState<ThreatFeedItem[]>([]);
  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = data[Math.floor(Math.random() * Math.max(1, data.length))];
      if (next) setLiveItems((current) => [{ ...next, id: `${next.id}-${Date.now()}`, timestamp: new Date().toISOString(), title: `Live-обновление: ${next.title}` }, ...current].slice(0, 8));
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [data]);
  const items = [...liveItems, ...data].slice(0, 28);
  return (
    <Box><Text color={COLORS.textMuted} fontSize="11px" fontWeight="600" letterSpacing="0.1em">РАЗВЕДКА</Text><Heading mb="16px" fontSize="24px">Лента угроз</Heading>
      <VStack align="stretch" spacing="10px">{items.map((item, index) => <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.03, 0.18), duration: 0.2 }} key={item.id}><GlassCard p="20px"><HStack justify="space-between"><HStack><SeverityBadge severity={item.severity} /><Text fontWeight="500">{item.title}</Text></HStack><Text color={COLORS.textMuted} fontFamily="mono" fontSize="11px">{formatDate(item.timestamp)}</Text></HStack><Text color={COLORS.textSecondary} fontSize="13px">{item.description}</Text><Text fontFamily="mono" fontWeight="500" fontSize="11px" color={COLORS.info}>{item.source} · {item.tags.join(' · ')}</Text></GlassCard></motion.div>)}</VStack>
    </Box>
  );
}
