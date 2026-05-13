import { Center, Text, VStack } from '@chakra-ui/react';
import { FiDatabase } from 'react-icons/fi';
import { COLORS } from '../constants';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Center minH="220px" border="1px dashed" borderColor={COLORS.borderStrong} borderRadius="lg">
      <VStack color={COLORS.textSecondary}>
        <FiDatabase size={34} color={COLORS.info} />
        <Text color={COLORS.textPrimary} fontWeight="500">{title}</Text>
        <Text fontSize="13px">{description}</Text>
      </VStack>
    </Center>
  );
}
