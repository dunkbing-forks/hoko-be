import React from "react";
import { LeftLogo, RightLogo } from '../../atoms';
import { HeaderContainer, Toolbar } from './style';

type Props = {
  title: string;
}

export const Header: React.FC<Props> = ({ title }) => {
  return (
    <HeaderContainer>
      <Toolbar>
        <RightLogo>{title}</RightLogo>
        <div style={{ flexGrow: 1 }} />
        <LeftLogo />
      </Toolbar>
    </HeaderContainer>
  );
};
