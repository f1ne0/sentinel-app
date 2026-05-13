import { Box, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Grid, Heading, Text, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { GlassCard } from '../../shared/ui/GlassCard';
import { mitreTactics, mitreTechniques } from '../../shared/mock/mitreData';
import { COLORS } from '../../shared/constants';
import type { MitreTechnique } from '../../shared/types';

export function MitrePage() {
  const [active, setActive] = useState<MitreTechnique | null>(null);
  const drawer = useDisclosure();
  const open = (technique: MitreTechnique) => { setActive(technique); drawer.onOpen(); };
  return (
    <Box><Text color={COLORS.textMuted} fontSize="11px" fontWeight="600" letterSpacing="0.1em">РАЗВЕДКА</Text><Heading mb="16px" fontSize="24px">Матрица MITRE ATT&CK</Heading>
      <Grid templateColumns={`repeat(${mitreTactics.length}, minmax(150px, 1fr))`} gap="10px" overflowX="auto">
        {mitreTactics.map((tactic) => <Box key={tactic}><Text fontSize="11px" color={COLORS.textMuted} fontWeight="600" letterSpacing="0.08em" mb="8px">{tactic.toUpperCase()}</Text>{mitreTechniques.filter((t) => t.tactic === tactic).map((technique) => <GlassCard as="button" display="block" textAlign="left" w="100%" key={technique.id} p="12px" mb="8px" bg={`rgba(15,17,22,${0.55 + Math.min((technique.frequency ?? 0) / 500, 0.18)})`} onClick={() => open(technique)}><Text fontFamily="mono" fontWeight="500" color={COLORS.info}>{technique.id}</Text><Text fontSize="13px">{technique.name}</Text><Text color={COLORS.textMuted} fontFamily="mono" fontSize="11px">{technique.frequency} срабатываний</Text></GlassCard>)}</Box>)}
      </Grid>
      <Drawer isOpen={drawer.isOpen} onClose={drawer.onClose} placement="right"><DrawerOverlay /><DrawerContent bg={COLORS.bgElevated}><DrawerHeader>{active?.id} · {active?.name}</DrawerHeader><DrawerBody><Text color={COLORS.textSecondary}>{active?.description}</Text><Text mt="14px">Связанные образцы: sample-4, sample-12, sample-29</Text><Text>Митигация: мониторить цепочки поведения и ограничивать лишнее исполнение скриптов.</Text></DrawerBody></DrawerContent></Drawer>
    </Box>
  );
}
