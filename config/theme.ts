import { extendTheme } from '@chakra-ui/react';

export const customTheme = extendTheme({
  styles: {
    global: {
      a: {
        _hover: {
          textDecoration: 'none',
        },
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      sizes: {
        lg: {
          w: '100%',
          h: '50px',
        },
      },
      variants: {
        fota: {
          bg: '#5445FF',
          color: '#FFF',
          _disabled: {
            opacity: 1,
            bg: 'gray.500',
            cursor: 'not-allowed',
          },
          _hover: {
            bg: '#5445FF',
          },
          '&:hover[disabled]': {
            opacity: 1,
            bg: 'gray.500',
          },
        },
      },
    },
  },
});
