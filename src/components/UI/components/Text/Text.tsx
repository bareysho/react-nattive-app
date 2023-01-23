import React, { FC, PropsWithChildren } from 'react';
import styled from 'styled-components/native';
import { TextProps } from 'react-native';

import { valueToPx } from '../../utils/common';
import { baseElementCss } from '../../css/baseElementCss';
import { IBaseElementStyleProps, IText } from '../../types/common';

const TextStyled = styled.Text<IBaseElementStyleProps & IText>`
  font-size: ${props => valueToPx(props.fontSize) || '16px'};
  font-weight: ${props => props.fontWeight || 'normal'};
  text-align: ${props => props.textAlign || 'left'};
  text-decoration: ${props => props.textDecoration || 'none'};
  color: ${props => props.color || 'left'};
  ${baseElementCss}
`;

export type TextExternalProps = IText & TextProps & IBaseElementStyleProps;

export const Text: FC<PropsWithChildren<TextExternalProps>> = ({
  children,
  color = '#404040',
  fontSize = 16,
  ...rest
}) => {
  return (
    <TextStyled {...rest} color={color} fontSize={fontSize}>
      {children}
    </TextStyled>
  );
};
