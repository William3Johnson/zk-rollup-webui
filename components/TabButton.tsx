import { Box, Button, ChakraProps, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

export const TabButtonNavContainer: React.FC<{
  containerProps?: ChakraProps;
  navs: { title: string; url?: string }[];
  onClick(url: string | undefined): void;
}> = (props) => {
  const { navs, onClick, containerProps } = props;

  const router = useRouter();

  return (
    <HStack bg='#F1F0FF' borderRadius='360px' h='38px' padding='2px 8px' {...containerProps}>
      {navs.map((nav, index) => (
        <TabButton
          key={index}
          title={nav.title}
          isActive={router.pathname === nav.url}
          onClick={() => {
            onClick(nav.url);
          }}
        />
      ))}
    </HStack>
  );
};

export const TabButtonContainer: React.FC<{
  containerProps?: ChakraProps;
  navs: { title: string }[];
  onChange(index: number): void;
  tabIndex: number;
}> = (props) => {
  const { tabIndex, navs, onChange, containerProps } = props;

  return (
    <HStack bg='#F1F0FF' borderRadius='360px' h='38px' padding='2px 8px' {...containerProps}>
      {navs.map((nav, index) => (
        <TabButton
          key={index}
          title={nav.title}
          isActive={index === tabIndex}
          onClick={() => {
            onChange(index);
          }}
        />
      ))}
    </HStack>
  );
};

const TabButton: React.FC<{ title: string; isActive: boolean; onClick(): void }> = (props) => {
  const { isActive, onClick } = props;

  return (
    <Button
      w='full'
      h='29px'
      lineHeight='29px'
      borderRadius='360px'
      bg={isActive ? '#FFF' : '#F1F0FF'}
      boxShadow={isActive ? '0px 16px 24px rgba(0, 0, 0, 0.06)' : ''}
      onClick={onClick}
      _hover={{ bg: '#FFF' }}
    >
      <Box
        color={isActive ? '#5445FF' : '#76808F'}
        fontSize='14px'
        fontWeight={500}
        w='full'
        h='full'
      >
        {props.title}
      </Box>
    </Button>
  );
};
