export interface IPrimaryColors {
  primary: string;
  primaryPressed: string;
  disabled: string;
  text: string;
  disabledText: string;
  background: string;
  cardBackground: string;
  pressablePressed: string;
  iconColor: string;
  inputBorder: string;
  error: string;
}

export const LIGHT_PRIMARY_COLORS: IPrimaryColors = {
  primary: '#FDDB3A',
  primaryPressed: '#facc15',
  pressablePressed: '#d4d4d4',
  disabled: '#d4d4d4',
  disabledText: '#737373',
  text: '#41444B',
  background: '#f9fafb',
  cardBackground: '#e5e5e5',
  inputBorder: '#d1d5db',
  iconColor: '#737373',
  error: '#dc2626',
};

export const DARK_PRIMARY_COLORS: IPrimaryColors = {
  ...LIGHT_PRIMARY_COLORS,
  text: '#fafafa',
  pressablePressed: '#4b5563',
  background: '#4b5563',
  cardBackground: '#374151',
  iconColor: '#e5e5e5',
  error: '#f87171',
};
