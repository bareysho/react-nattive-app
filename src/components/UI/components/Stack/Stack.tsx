import React, { FC, ReactNode } from 'react';
import styled from 'styled-components/native';

import { baseElementCss } from '../../css/baseElementCss';
import { IBaseElementStyleProps } from '../../types/common';

const BoxStyled = styled.View<IBaseElementStyleProps>`
  ${baseElementCss}
`;

export interface IStackContainer extends IBaseElementStyleProps {
  children?: ReactNode;
}

export const Box: FC<IStackContainer> = ({ children, ...rest }) => (
  <BoxStyled {...rest}>{children}</BoxStyled>
);
export const Flex: FC<IStackContainer> = ({ children, ...rest }) => (
  <Box {...rest} display="flex">
    {children}
  </Box>
);
export const VStack: FC<IStackContainer> = ({ children, ...rest }) => (
  <Flex {...rest} flexDirection="column">
    {children}
  </Flex>
);
export const HStack: FC<IStackContainer> = ({ children, ...rest }) => (
  <Flex {...rest} flexDirection="row">
    {children}
  </Flex>
);
export const Center: FC<IStackContainer> = ({ children, ...rest }) => (
  <Flex {...rest} justifyContent="center" alignItems="center">
    {children}
  </Flex>
);
