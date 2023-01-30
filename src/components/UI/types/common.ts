export interface IPadding {
  p?: number;
  px?: number;
  py?: number;
  pb?: number;
  pt?: number;
  pl?: number;
  pr?: number;
}

export interface IShadow {
  shadow?: number;
}

export interface IMargin {
  m?: number;
  mx?: number;
  my?: number;
  mb?: number;
  mt?: number;
  mr?: number;
  ml?: number;
}

export interface IFlex {
  display?: 'flex';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-evenly';
  flex?: number;
  alignItems?: 'flex-start' | 'flex-end' | 'center';
  alignContent?: 'flex-start' | 'flex-end' | 'center';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  alignSelf?: 'flex-start' | 'flex-end' | 'center';
}

export interface ISize {
  size?: number;
  width?: number | string;
  minWidth?: number | string;
  height?: number | string;
  minHeight?: number | string;
}

export interface IBorder {
  rounded?: number;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number | string;
  borderBottomWidth?: number | string;
}

export interface IBackground {
  backgroundColor?: string;
}

export interface IColor {
  color?: string;
  opacity?: number;
}

export interface IText {
  fontSize?: number;
  fontWeight?: number;
  textDecoration?:
    | 'none'
    | 'underline'
    | 'line-through'
    | 'underline line-through'
    | undefined;
  textAlign?: 'left' | 'center' | 'right' | undefined;
  color?: string;
}

export interface IPosition {
  position?: 'relative' | 'absolute' | 'fixed';
  zIndex?: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export type IBaseElementStyleProps = IPadding &
  IMargin &
  IFlex &
  IShadow &
  ISize &
  IBorder &
  IColor &
  IPosition &
  IBackground;
