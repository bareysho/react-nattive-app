import { css } from 'styled-components/native';

import { transformMargin, transformPadding, valueToPx } from '../utils/common';
import { IBaseElementStyleProps } from '../types/common';

const shadow = css<IBaseElementStyleProps>`
  elevation: ${props => props.shadow};
`;

export const baseElementCss = css<IBaseElementStyleProps>`
  width: ${props => valueToPx(props.width || props.size) || 'auto'};
  min-width: ${props => valueToPx(props.minWidth) || 'auto'};
  height: ${props => valueToPx(props.height || props.size) || 'auto'};
  min-height: ${props => valueToPx(props.minHeight) || 'auto'};
  ${props => transformPadding(props || {})};
  ${props => transformMargin(props || {})};
  z-index: ${props => props.zIndex || 1};
  align-items: ${props => props.alignItems || 'flex-start'};
  align-content: ${props => props.alignContent || 'flex-start'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  flex-direction: ${props => props.flexDirection || 'column'};
  background-color: ${props => props.backgroundColor || 'transparent'};
  border-width: ${props => valueToPx(props.borderWidth) || 0.0};
  border-radius: ${props => valueToPx(props.rounded) || 0.0};
  border-color: ${props => props.borderColor || 'transparent'};
  color: ${props => props.color || 'transparent'};
  opacity: ${({ opacity = 1 }) => opacity};
  position: ${props => props.position || 'relative'};
  top: ${props => valueToPx(props.top) || 'auto'};
  bottom: ${props => valueToPx(props.bottom) || 'auto'};
  left: ${props => valueToPx(props.left) || 'auto'};
  right: ${props => valueToPx(props.right) || 'auto'};
  flex-grow: ${props => props.flex || 0};
  border-bottom-width: ${props =>
    valueToPx(props.borderBottomWidth) || valueToPx(props.borderWidth) || 0.0};
  ${props => props.shadow && shadow}
`;
