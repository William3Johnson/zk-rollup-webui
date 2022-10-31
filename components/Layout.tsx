import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';
import { Header } from './Header';
import Nav from './Nav';

interface IProps {
  children: JSX.Element;
}

const Layout: React.FC<IProps> = ({ children }) => {
  return (
    <Grid
      h='100vh'
      gridTemplateRows='68px 1fr'
      gridTemplateColumns='220px 1fr'
      gridTemplateAreas={`"sidebar header" "sidebar content"`}
    >
      <GridItem gridArea='sidebar' bg='#FFF'>
        <Nav />
      </GridItem>

      <GridItem
        bg='#FFF'
        gridArea='header'
        display='flex'
        justifyContent='flex-end'
        alignItems='center'
        padding='14px 16px'
      >
        <Header />
      </GridItem>

      <GridItem gridArea='content' bg='#F5F5F5'>
        {children}
      </GridItem>
    </Grid>
  );
};

export default Layout;
