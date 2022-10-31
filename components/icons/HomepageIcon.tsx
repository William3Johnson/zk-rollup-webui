import { Icon } from '@chakra-ui/react';
import React from 'react';

const HomepageIcon: React.FC<{ color?: string; boxSize?: number }> = (props) => {
  const { boxSize = 18, color = '#1E2026' } = props;

  return (
    <Icon boxSize={boxSize} color={color}>
      <path
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M16 16.2687V7.58544L9 1.72498L2 7.58544V16.2687H16ZM1.0371 6.4353C0.696676 6.72031 0.5 7.14147 0.5 7.58544V16.2687C0.5 17.0971 1.17157 17.7687 2 17.7687H16C16.8284 17.7687 17.5 17.0971 17.5 16.2687V7.58544C17.5 7.14147 17.3033 6.7203 16.9629 6.4353L9.9629 0.574839C9.40571 0.108354 8.59429 0.108355 8.0371 0.574839L1.0371 6.4353Z'
      />
    </Icon>
  );
};

export default HomepageIcon;
