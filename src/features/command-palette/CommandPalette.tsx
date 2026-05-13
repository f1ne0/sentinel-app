import { Button, HStack, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { ROUTES, COLORS } from '../../shared/constants';
import { analyses } from '../../shared/mock/analyses';
import { formatHash } from '../../shared/utils';
import { useState } from 'react';

const nav = [
  ['Панель мониторинга', ROUTES.dashboard],
  ['Загрузка образца', ROUTES.upload],
  ['История анализа', ROUTES.history],
  ['Отчёты об угрозах', ROUTES.reports],
  ['База IOC', ROUTES.indicators],
  ['MITRE ATT&CK', ROUTES.mitre],
  ['Лента угроз', ROUTES.threats],
] as const;

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const samples = analyses.filter((item) => item.fileName.toLowerCase().includes(query.toLowerCase()) || item.sha256.includes(query)).slice(0, 5);
  const go = (path: string) => { navigate(path); onClose(); setQuery(''); };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay bg="rgba(0,0,0,0.72)" />
      <ModalContent bg={COLORS.bgElevated} border="1px solid" borderColor={COLORS.borderStrong} borderRadius="lg">
        <ModalHeader>Командная палитра</ModalHeader>
        <ModalBody pb="18px">
          <Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Навигация или поиск хэша" bg={COLORS.bgSurface} borderColor={COLORS.borderStrong} mb="14px" />
          <VStack align="stretch" spacing="6px">
            {nav.filter(([label]) => label.toLowerCase().includes(query.toLowerCase()) || !query).slice(0, 6).map(([label, path]) => (
              <Button key={path} justifyContent="space-between" variant="ghost" onClick={() => go(path)} rightIcon={<FiArrowRight />}>{label}</Button>
            ))}
            {samples.map((sample) => (
              <HStack as="button" key={sample.id} justify="space-between" p="12px" borderRadius="md" _hover={{ bg: 'rgba(255,255,255,0.04)' }} onClick={() => go(ROUTES.analysis(sample.id))}>
                <Text fontWeight="500">{sample.fileName}</Text>
                <Text fontFamily="mono" fontWeight="500" color={COLORS.info}>{formatHash(sample.sha256, 6)}</Text>
              </HStack>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
