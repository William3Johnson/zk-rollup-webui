import { Icon } from '@chakra-ui/react';
import React from 'react';

const AtomSwapIcon: React.FC<{ color?: string; boxSize?: number }> = (props) => {
  const { boxSize = 18, color = '#1E2026' } = props;

  return (
    <Icon boxSize={boxSize} color={color}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.7197 4.71967C15.0126 4.42678 15.4874 4.42678 15.7803 4.71967L19.7803 8.71967C19.9948 8.93417 20.059 9.25676 19.9429 9.53701C19.8268 9.81727 19.5533 10 19.25 10L4.75 10C4.33579 10 4 9.66421 4 9.25C4 8.83579 4.33579 8.5 4.75 8.5L17.4393 8.5L14.7197 5.78033C14.4268 5.48744 14.4268 5.01256 14.7197 4.71967Z'
        fill='currentColor'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M4.05711 14.463C4.1732 14.1827 4.44668 14 4.75002 14L19.25 14C19.6642 14 20 14.3358 20 14.75C20 15.1642 19.6642 15.5 19.25 15.5L6.56068 15.5L9.28035 18.2197C9.57325 18.5126 9.57325 18.9874 9.28035 19.2803C8.98746 19.5732 8.51259 19.5732 8.21969 19.2803L4.21969 15.2803C4.00519 15.0658 3.94103 14.7432 4.05711 14.463Z'
        fill='currentColor'
      />
    </Icon>
  );
};

export default AtomSwapIcon;
