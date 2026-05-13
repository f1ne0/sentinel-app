import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Sidebar } from '../../widgets/sidebar/Sidebar';
import { Topbar } from '../../widgets/topbar/Topbar';
import { CommandPalette } from '../../features/command-palette/CommandPalette';
import { ROUTES } from '../../shared/constants';

export function MainLayout() {
  const command = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        command.onOpen();
      }
      if (event.key.toLowerCase() === 'd' && event.getModifierState('Alt')) navigate(ROUTES.dashboard);
      if (event.key.toLowerCase() === 'u' && event.getModifierState('Alt')) navigate(ROUTES.upload);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [command, navigate]);

  return (
    <Flex minH="100vh">
      <Sidebar />
      <Flex direction="column" flex="1" minW="0" ml={{ base: '72px', xl: '240px' }}>
        <Topbar onCommand={command.onOpen} />
        <Box as="main" p={{ base: '16px', xl: '24px' }} minW="0">
          <AnimatePresence mode="wait">
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Flex>
      <CommandPalette isOpen={command.isOpen} onClose={command.onClose} />
    </Flex>
  );
}
