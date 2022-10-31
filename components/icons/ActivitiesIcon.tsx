import { Icon } from '@chakra-ui/react';
import React from 'react';

const ActivitiesIcon: React.FC<{ color?: string; boxSize?: number }> = (props) => {
  const { boxSize = 18, color = '#1E2026' } = props;

  return (
    <Icon boxSize={boxSize} color={color}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 11.5C13.933 11.5 15.5 9.933 15.5 8C15.5 6.067 13.933 4.5 12 4.5C10.067 4.5 8.5 6.067 8.5 8C8.5 9.933 10.067 11.5 12 11.5ZM12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13Z'
        fill='currentColor'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5.34109 18.9717C5.38629 18.9888 5.44059 19 5.49987 19H18.4999C18.5591 19 18.6134 18.9888 18.6586 18.9717C17.8015 17.1112 15.2936 15.5 11.9999 15.5C8.70614 15.5 6.19825 17.1112 5.34109 18.9717ZM3.88867 18.5508C4.97146 15.9133 8.19348 14 11.9999 14C15.8063 14 19.0283 15.9133 20.1111 18.5508C20.5306 19.5726 19.6044 20.5 18.4999 20.5H5.49987C4.3953 20.5 3.46918 19.5726 3.88867 18.5508Z'
        fill='currentColor'
      />
    </Icon>
  );
};

export default ActivitiesIcon;
