import React, { FC, ReactElement } from 'react';
import { Image } from 'react-native';

import { ThemeType, useTheme } from '@src/components/UI';

export enum ImageAppName {
  Squat = 'squat',
  PushUp = 'pushUp',
  SitUp = 'sitUp',
}

interface IImageApp {
  name: ImageAppName;
  size?: number;
  themeType?: ThemeType;
}

export const ImageApp: FC<IImageApp> = ({ name, size = 44, themeType }) => {
  const { themeType: inAppThemeType } = useTheme();

  const ICON_MAPPER_DARK_THEME: Record<ImageAppName, ReactElement> = {
    [ImageAppName.Squat]: (
      <Image
        style={{ height: size, width: size }}
        source={require('./images/squats-white.png')}
      />
    ),
    [ImageAppName.PushUp]: (
      <Image
        style={{ height: size, width: size }}
        source={require('./images/push-up-white.png')}
      />
    ),
    [ImageAppName.SitUp]: (
      <Image
        style={{ height: size, width: size }}
        source={require('./images/sit-up-white.png')}
      />
    ),
  };

  const ICON_MAPPER_LIGHT_THEME: Record<ImageAppName, ReactElement> = {
    [ImageAppName.Squat]: (
      <Image
        style={{ height: size, width: size }}
        source={require('./images/squats.png')}
      />
    ),
    [ImageAppName.PushUp]: (
      <Image
        style={{ height: size, width: size }}
        source={require('./images/push-up.png')}
      />
    ),
    [ImageAppName.SitUp]: (
      <Image
        style={{ height: size, width: size }}
        source={require('./images/sit-up.png')}
      />
    ),
  };

  const ICONS_BY_THEME = {
    [ThemeType.Dark]: ICON_MAPPER_DARK_THEME,
    [ThemeType.Light]: ICON_MAPPER_LIGHT_THEME,
  };

  return ICONS_BY_THEME[themeType || inAppThemeType][name];
};
