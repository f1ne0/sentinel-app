import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { COLORS } from '../../shared/constants';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  fonts: {
    heading: "'Manrope', sans-serif",
    body: "'Manrope', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radii: { sm: '4px', md: '6px', lg: '8px' },
  colors: {
    sentinel: COLORS,
  },
  styles: {
    global: (props: Record<string, unknown>) => ({
      '*': { boxSizing: 'border-box' },
      'input, select, textarea, button': {
        outline: 'none',
      },
      '.chakra-input, .chakra-select': {
        borderWidth: '1px !important',
        borderStyle: 'solid !important',
        borderColor: `${COLORS.borderSubtle} !important`,
        background: `${COLORS.bgSurface} !important`,
        boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.4) !important',
      },
      '.chakra-input:hover, .chakra-select:hover': {
        borderColor: `${COLORS.borderStrong} !important`,
      },
      '.chakra-input:focus, .chakra-input:focus-visible, .chakra-select:focus, .chakra-select:focus-visible, .chakra-input[data-focus], .chakra-select[data-focus]': {
        borderColor: `${COLORS.info} !important`,
        boxShadow: '0 0 0 3px rgba(6,182,212,0.1), inset 0 1px 0 rgba(0,0,0,0.4) !important',
        outline: 'none !important',
      },
      '.chakra-input[aria-invalid=true], .chakra-select[aria-invalid=true]': {
        borderColor: `${COLORS.critical} !important`,
      },
      body: {
        bg: mode(COLORS.bgBase, COLORS.bgBase)(props),
        color: COLORS.textPrimary,
        minW: '320px',
        fontSize: '14px',
        lineHeight: 1.5,
        fontWeight: 400,
        fontVariantNumeric: 'tabular-nums',
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(228,231,236,0.055) 1px, transparent 0)',
        backgroundSize: '32px 32px',
      },
      '#root': { minH: '100vh' },
      '::selection': { bg: 'rgba(6,182,212,0.22)' },
      '.recharts-text': {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px',
      },
      '.chakra-skeleton': {
        borderRadius: '6px',
      },
      '@media print': {
        '.no-print': { display: 'none !important' },
        body: { bg: '#F7F8FA', color: '#111318' },
      },
    }),
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 600,
        letterSpacing: '0',
        lineHeight: 1.2,
      },
    },
    Button: {
      baseStyle: {
        borderRadius: 'md',
        fontWeight: 500,
        transition: 'background 150ms ease, border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease',
        _focusVisible: { boxShadow: `0 0 0 3px rgba(6,182,212,0.1)`, borderColor: COLORS.info },
        _hover: { transform: 'translateY(-1px)' },
      },
      sizes: {
        sm: { h: '32px', minW: '32px', px: '12px', fontSize: '13px' },
        md: { h: '36px', minW: '36px', px: '12px', fontSize: '14px' },
        lg: { h: '40px', minW: '40px', px: '16px', fontSize: '14px' },
      },
      variants: {
        solid: {
          bg: COLORS.bgElevated,
          color: COLORS.textPrimary,
          border: '1px solid',
          borderColor: COLORS.borderStrong,
          borderBottomColor: '#101319',
          _hover: { bg: '#1A1E27' },
        },
        outline: {
          bg: 'transparent',
          color: COLORS.textPrimary,
          border: '1px solid',
          borderColor: COLORS.borderSubtle,
          _hover: { bg: 'rgba(255,255,255,0.04)', borderColor: COLORS.borderStrong },
        },
        ghost: {
          color: COLORS.textSecondary,
          _hover: { bg: 'rgba(255,255,255,0.04)', color: COLORS.textPrimary },
        },
      },
      defaultProps: {
        size: 'md',
        variant: 'solid',
      },
    },
    Input: {
      baseStyle: {
        field: {
          h: '36px',
          borderRadius: 'md',
          borderColor: COLORS.borderSubtle,
          bg: COLORS.bgSurface,
          boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.4)',
          _hover: { borderColor: COLORS.borderStrong },
          _focusVisible: {
            borderColor: COLORS.info,
            boxShadow: '0 0 0 3px rgba(6,182,212,0.1), inset 0 1px 0 rgba(0,0,0,0.4)',
          },
        },
      },
      variants: {
        outline: {
          field: {
            border: '1px solid',
            borderColor: COLORS.borderSubtle,
            bg: COLORS.bgSurface,
            color: COLORS.textPrimary,
            _placeholder: { color: COLORS.textMuted },
            _hover: { borderColor: COLORS.borderStrong },
            _focus: {
              borderColor: COLORS.info,
              boxShadow: '0 0 0 3px rgba(6,182,212,0.1), inset 0 1px 0 rgba(0,0,0,0.4)',
            },
            _focusVisible: {
              borderColor: COLORS.info,
              boxShadow: '0 0 0 3px rgba(6,182,212,0.1), inset 0 1px 0 rgba(0,0,0,0.4)',
            },
          },
        },
      },
      defaultProps: {
        variant: 'outline',
      },
    },
    Select: {
      baseStyle: {
        field: {
          h: '36px',
          borderRadius: 'md',
          borderColor: COLORS.borderSubtle,
          bg: COLORS.bgSurface,
          boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.4)',
          _hover: { borderColor: COLORS.borderStrong },
          _focusVisible: {
            borderColor: COLORS.info,
            boxShadow: '0 0 0 3px rgba(6,182,212,0.1), inset 0 1px 0 rgba(0,0,0,0.4)',
          },
        },
      },
      variants: {
        outline: {
          field: {
            border: '1px solid',
            borderColor: COLORS.borderSubtle,
            bg: COLORS.bgSurface,
            color: COLORS.textPrimary,
            _hover: { borderColor: COLORS.borderStrong },
            _focus: {
              borderColor: COLORS.info,
              boxShadow: '0 0 0 3px rgba(6,182,212,0.1), inset 0 1px 0 rgba(0,0,0,0.4)',
            },
            _focusVisible: {
              borderColor: COLORS.info,
              boxShadow: '0 0 0 3px rgba(6,182,212,0.1), inset 0 1px 0 rgba(0,0,0,0.4)',
            },
          },
          icon: {
            color: COLORS.textSecondary,
          },
        },
      },
      defaultProps: {
        variant: 'outline',
      },
    },
    Table: {
      baseStyle: {
        th: {
          h: '36px',
          color: COLORS.textMuted,
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          borderBottom: `1px solid ${COLORS.bgElevated}`,
        },
        td: {
          h: '48px',
          borderBottom: `1px solid ${COLORS.bgElevated}`,
          fontSize: '13px',
        },
      },
    },
  },
});
