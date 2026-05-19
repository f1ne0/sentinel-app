import { Box, Button, HStack, IconButton, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, Text, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiCommand, FiSearch, FiUser } from 'react-icons/fi';
import { analyses } from '../../shared/mock/analyses';
import { COLORS, ROUTES } from '../../shared/constants';
import { formatHash } from '../../shared/utils';
import { useState } from 'react';

export function Topbar({ onCommand }: { onCommand: () => void }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const submit = () => {
    const match = analyses.find((item) => item.sha256.includes(query.trim()) || item.fileName.toLowerCase().includes(query.toLowerCase().trim()));
    if (match) navigate(ROUTES.analysis(match.id));
    else toast({ title: 'Совпадающий образец не найден', status: 'warning', duration: 1800 });
  };

  return (
    <HStack h="56px" px="24px" borderBottom="1px solid" borderColor={COLORS.borderSubtle} bg="rgba(8,9,12,0.78)" backdropFilter="blur(20px)" justify="space-between" className="no-print">
      <InputGroup maxW="520px">
        <InputLeftElement pointerEvents="none"><FiSearch color={COLORS.textMuted} /></InputLeftElement>
        <Input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && submit()} placeholder="Вставьте SHA-256 или имя файла" fontFamily="mono" fontWeight="500" fontSize="13px" />
      </InputGroup>
      <HStack spacing="8px">
        <Button leftIcon={<FiCommand />} variant="outline" onClick={onCommand}>Cmd K</Button>
        <Menu>
          <MenuButton as={IconButton} aria-label="Notifications" icon={<FiBell />} variant="outline" />
          <MenuList zIndex={1500} bg={COLORS.bgElevated} borderColor={COLORS.borderStrong} fontSize="13px">
            {analyses.slice(0, 3).map((item) => <MenuItem key={item.id} bg="transparent">{item.fileName} · <Text as="span" fontFamily="mono" color={COLORS.info}>{formatHash(item.sha256, 5)}</Text></MenuItem>)}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} leftIcon={<FiUser />} variant="outline">
            <Box display={{ base: 'none', lg: 'block' }}><Text fontSize="13px">Аналитик</Text></Box>
          </MenuButton>
          <MenuList zIndex={1500} bg={COLORS.bgElevated} borderColor={COLORS.borderStrong} fontSize="13px">
            <MenuItem bg="transparent">Кенжебаев Равшанбек · SOC Tier 2</MenuItem>
            <MenuItem bg="transparent">Форензик-рабочее пространство</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  );
}
