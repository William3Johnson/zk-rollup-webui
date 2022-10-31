import { Box, Container } from '@chakra-ui/react';
import React from 'react';

const W = '400px';

export const Card: React.FC<{
  title: string;
  desc: string;
  children: React.ReactNode;
  Nav?: React.ReactNode;
  Footer: React.ReactNode;
  onSubmit?(): void;
}> = (props) => {
  const { title, desc, children, Nav, Footer, onSubmit } = props;

  return (
    <Container as='form' onSubmit={onSubmit} margin='32px auto' w={W}>
      <Box
        borderRadius='16px'
        bg='#FFF'
        boxShadow='0px 8px 24px rgba(0, 0, 0, 0.08)'
        padding='24px'
      >
        <h1
          style={{
            color: ' #1E2026',
            fontSize: 20,
            textAlign: 'center',
            fontWeight: 600,
            marginTop: 8,
          }}
        >
          {title}
        </h1>
        <h2
          style={{
            lineHeight: '21px',
            color: '#76808F',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          {desc}
        </h2>

        <Box marginTop='25px'>{Nav}</Box>

        <>{children}</>
      </Box>

      {Footer}
    </Container>
  );
};
