import { SPACING } from '../constants/spacing';
import { IMargin, IPadding } from '../types/common';
import { IInput } from '../components/Input/Input';
import { IInputForm } from '../components/FormControlWrapper/FormControlWrapper';

export const valueToPx = (value?: number | string) => {
  if (typeof value === 'undefined') {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  return `${value}px`;
};

export const transformOffset = (
  offsetName: string,
  aV?: number,
  tV?: number,
  bV?: number,
  lV?: number,
  rV?: number,
  yV?: number,
  xV?: number,
) => {
  const a = (aV && SPACING[aV]) || aV;
  const t = (tV && SPACING[tV]) || tV;
  const b = (bV && SPACING[bV]) || bV;
  const l = (lV && SPACING[lV]) || lV;
  const r = (rV && SPACING[rV]) || rV;
  const y = (yV && SPACING[yV]) || yV;
  const x = (xV && SPACING[xV]) || xV;

  const pProp = a ? { padding: `${a}px ${a}px ${a}px ${a}px` } : {};

  const ptProp = t ? { [`${offsetName}-top`]: `${t}px` } : {};
  const pbProp = b ? { [`${offsetName}-bottom`]: `${b}px` } : {};
  const prProp = r ? { [`${offsetName}-right`]: `${r}px` } : {};
  const plProp = l ? { [`${offsetName}-left`]: `${l}px` } : {};

  const pyProp = y
    ? { [`${offsetName}-bottom`]: `${y}px`, [`${offsetName}-top`]: `${y}px` }
    : {};
  const pxProp = x
    ? { [`${offsetName}-left`]: `${x}px`, [`${offsetName}-right`]: `${x}px` }
    : {};

  const paddings = {
    ...pProp,
    ...pyProp,
    ...pxProp,
    ...ptProp,
    ...pbProp,
    ...prProp,
    ...plProp,
  };

  if (Object.values(paddings).length) {
    return paddings;
  }

  return '0 0 0 0';
};

export const transformPadding = ({ pt, pb, pr, p, py, px, pl }: IPadding) =>
  transformOffset('padding', p, pt, pb, pl, pr, py, px);

export const transformMargin = ({ mt, mb, mr, m, my, mx, ml }: IMargin) =>
  transformOffset('margin', m, mt, mb, ml, mr, my, mx);

export const separateInputProps = (props: IInput & IInputForm) => {
  const {
    m,
    mb,
    mt,
    mx,
    my,
    mr,
    ml,
    py,
    px,
    pb,
    pt,
    p,
    pl,
    pr,
    position,
    height,
    minHeight,
    width,
    minWidth,
    opacity,
    label,
    error,
    helpText,
    ...inputProps
  } = props;

  const wrapperProps = {
    m,
    mb,
    mt,
    mx,
    my,
    mr,
    ml,
    py,
    px,
    pb,
    pt,
    p,
    pl,
    pr,
    label,
    error,
    helpText,
    position,
    height,
    minHeight,
    width,
    minWidth,
    opacity,
  };

  return { inputProps, wrapperProps };
};

export const getButtonBackgroundColor = ({
  normalColor,
  pressedColor,
  disabledColor,
  loadingColor,
  pressed,
  loading,
  disabled,
}: {
  normalColor?: string;
  pressedColor?: string;
  disabledColor?: string;
  loadingColor?: string;
  loading?: boolean;
  disabled?: boolean;
  pressed?: boolean;
}) => {
  if (loading) {
    return loadingColor;
  }

  if (disabled) {
    return disabledColor;
  }

  if (pressed) {
    return pressedColor;
  }

  return normalColor;
};
