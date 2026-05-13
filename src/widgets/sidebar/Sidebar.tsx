import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FiBarChart2, FiCpu, FiDatabase, FiFileText, FiGrid, FiRadio, FiShield, FiUploadCloud } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { ROUTES, COLORS } from '../../shared/constants';

interface NavItem { label: string; path: string; icon: IconType }
const sections: { title: string; items: NavItem[] }[] = [
  { title: 'ОБЗОР', items: [{ label: 'Панель мониторинга', path: ROUTES.dashboard, icon: FiGrid }] },
  { title: 'АНАЛИЗ', items: [{ label: 'Загрузка образца', path: ROUTES.upload, icon: FiUploadCloud }, { label: 'История анализа', path: ROUTES.history, icon: FiDatabase }] },
  { title: 'РАЗВЕДКА', items: [{ label: 'Отчёты об угрозах', path: ROUTES.reports, icon: FiBarChart2 }, { label: 'База IOC', path: ROUTES.indicators, icon: FiShield }, { label: 'MITRE ATT&CK', path: ROUTES.mitre, icon: FiCpu }, { label: 'Лента угроз', path: ROUTES.threats, icon: FiRadio }] },
  { title: 'ИНСАЙТЫ', items: [{ label: 'Инсайты безопасности', path: ROUTES.insights, icon: FiFileText }] },
];

export function Sidebar() {
  return (
    <Flex
      as="aside"
      direction="column"
      position="fixed"
      insetBlock="0"
      insetInlineStart="0"
      zIndex="20"
      w={{ base: '72px', xl: '240px' }}
      h="100vh"
      p="16px"
      borderRight="1px solid"
      borderColor={COLORS.borderSubtle}
      bg="rgba(8,9,12,0.96)"
      overflow="hidden"
      className="no-print"
    >
      <Box mb="32px">
        <Text fontSize="20px" fontWeight="600" letterSpacing="0">SENTINEL</Text>
        <Text display={{ base: 'none', xl: 'block' }} fontSize="11px" color={COLORS.textMuted}>Платформа анализа вредоносного ПО</Text>
      </Box>
      <VStack align="stretch" spacing="24px" flex="1">
        {sections.map((section) => (
          <Box key={section.title}>
            <Text display={{ base: 'none', xl: 'block' }} mb="8px" fontSize="11px" fontWeight="600" color={COLORS.textMuted} letterSpacing="0.1em">{section.title}</Text>
            <VStack align="stretch" spacing="4px">
              {section.items.map((item) => (
                <NavLink key={item.path} to={item.path} end={item.path === ROUTES.dashboard}>
                  {({ isActive }) => (
                    <HStack h="36px" px="10px" borderRadius="md" color={isActive ? COLORS.textPrimary : COLORS.textSecondary} bg={isActive ? 'rgba(21,24,31,0.88)' : 'transparent'} border="1px solid" borderColor={isActive ? COLORS.borderStrong : 'transparent'} transition="background 150ms ease, border-color 150ms ease, color 150ms ease" transform="none" _hover={{ color: COLORS.textPrimary, bg: 'rgba(255,255,255,0.04)', borderColor: COLORS.borderSubtle, transform: 'none' }}>
                      <item.icon size={15} color={isActive ? COLORS.info : COLORS.textMuted} />
                      <Text display={{ base: 'none', xl: 'block' }} fontSize="13px" fontWeight="500">{item.label}</Text>
                    </HStack>
                  )}
                </NavLink>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
      <HStack h="36px" px="10px" border="1px solid" borderColor={COLORS.borderSubtle} borderRadius="md" color={COLORS.textSecondary}>
        <Box w="6px" h="6px" borderRadius="full" bg={COLORS.safe} animation="pulse 2s infinite" />
        <Text display={{ base: 'none', xl: 'block' }} fontFamily="mono" fontSize="10px" fontWeight="500" letterSpacing="0.08em">LIVE</Text>
        <Text display={{ base: 'none', xl: 'block' }} fontSize="13px">3 новых сигнала</Text>
      </HStack>
    </Flex>
  );
}
