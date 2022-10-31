import { Icon } from '@chakra-ui/react';
import React from 'react';

const DepositIcon: React.FC<{ color?: string; boxSize?: number }> = (props) => {
  const { boxSize = 18, color = '#1E2026' } = props;

  return (
    <Icon boxSize={boxSize} color={color} viewBox='0 0 15 15'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M13 4H3C2.81591 4 2.66667 4.14924 2.66667 4.33333V11.6667C2.66667 11.8508 2.81591 12 3 12H13C13.1841 12 13.3333 11.8508 13.3333 11.6667V4.33333C13.3333 4.14924 13.1841 4 13 4ZM3 3C2.26362 3 1.66667 3.59695 1.66667 4.33333V11.6667C1.66667 12.403 2.26362 13 3 13H13C13.7364 13 14.3333 12.403 14.3333 11.6667V4.33333C14.3333 3.59695 13.7364 3 13 3H3Z'
        fill='currentColor'
      />
      <path d='M2.33333 6H13.6667V7H2.33333V6Z' fill='currentColor' />
      <path
        d='M9.66667 10.5C9.66667 10.2239 9.89053 10 10.1667 10H11.8333C12.1095 10 12.3333 10.2239 12.3333 10.5C12.3333 10.7761 12.1095 11 11.8333 11H10.1667C9.89053 11 9.66667 10.7761 9.66667 10.5Z'
        fill='currentColor'
      />
    </Icon>
  );
};

export default DepositIcon;
