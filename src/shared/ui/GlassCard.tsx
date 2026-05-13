import { Box, type BoxProps } from '@chakra-ui/react';
import { COLORS } from '../constants';

export function GlassCard(props: BoxProps) {
  return (
    <Box
      position="relative"
      border="1px solid"
      borderColor={COLORS.borderSubtle}
      bg="rgba(15,17,22,0.6)"
      backdropFilter="blur(20px)"
      borderRadius="lg"
      boxShadow="none"
      overflow="hidden"
      transition="transform 150ms ease, border-color 150ms ease, background 150ms ease, box-shadow 150ms ease"
      _before={{
        content: '""',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        bg: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 1px)',
      }}
      _hover={{ transform: 'translateY(-1px)', borderColor: COLORS.borderStrong, bg: 'rgba(21,24,31,0.72)' }}
      {...props}
    />
  );
}
