import React, { FC, ReactElement } from 'react';
import { Image } from 'react-native';

export enum ImageAppName {
  Squat = 'squat',
  PushUp = 'pushUp',
  SitUp = 'sitUp',
}

interface IImageApp {
  name: ImageAppName;
  size?: number;
}

export const ImageApp: FC<IImageApp> = ({ name, size = 44 }) => {
  const ICON_MAPPER: Record<ImageAppName, ReactElement> = {
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

  return ICON_MAPPER[name];
};
