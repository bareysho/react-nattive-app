import React, { createContext, ReactNode, useContext, useState } from 'react';

import {
  DARK_PRIMARY_COLORS,
  IPrimaryColors,
  LIGHT_PRIMARY_COLORS,
} from '@src/components/UI/components/ThemeProvider/lightPrimary';

export enum ThemeType {
  Dark = 'dark',
  Light = 'light',
}

interface IGlobalLoadingContext {
  theme: IPrimaryColors;
  themeType: ThemeType;
  switchTheme: (theme?: ThemeType) => void;
}

export const ThemeContext = createContext<IGlobalLoadingContext>({
  theme: LIGHT_PRIMARY_COLORS,
  themeType: ThemeType.Light,
  switchTheme: () => {},
});

const THEME_MAPPER: Record<ThemeType, ThemeType> = {
  [ThemeType.Dark]: ThemeType.Light,
  [ThemeType.Light]: ThemeType.Dark,
};

const THEME_COLORS_MAPPER: Record<ThemeType, IPrimaryColors> = {
  [ThemeType.Dark]: DARK_PRIMARY_COLORS,
  [ThemeType.Light]: LIGHT_PRIMARY_COLORS,
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeType, setThemeType] = useState(ThemeType.Dark);

  const switchTheme = (selectedTheme?: ThemeType) => {
    setThemeType(prev => {
      if (selectedTheme) {
        return selectedTheme;
      }

      return THEME_MAPPER[prev];
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: THEME_COLORS_MAPPER[themeType],
        themeType,
        switchTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const { theme, switchTheme, themeType } = useContext(ThemeContext);

  return { theme, switchTheme, themeType };
};
