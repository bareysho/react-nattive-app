import React, { FC } from 'react';

import { Button, Spinner } from '@src/components/UI';

interface ICircleButton {
  text: string | number;
  loaderColor?: string;
  shadow?: number;
  onPress?: () => void;
  withLoading?: boolean;
  backgroundColor?: string;
  pressedBackgroundColor?: string;
}
export const CircleButton: FC<ICircleButton> = ({
  text,
  onPress,
  shadow,
  withLoading = false,
  backgroundColor,
  loaderColor,
  pressedBackgroundColor,
}) => {
  return (
    <Button
      size={200}
      rounded={100}
      borderWidth={8}
      shadow={shadow}
      onPress={onPress}
      position="relative"
      borderColor="#e4e4e7"
      backgroundColor={backgroundColor}
      backgroundColorPressed={pressedBackgroundColor}
      _text={{ fontSize: 60, fontWeight: 300 }}
    >
      {withLoading && (
        <Spinner
          size={320}
          right={-115}
          position="absolute"
          color={loaderColor || backgroundColor}
          borderColor={backgroundColor}
        />
      )}

      {text.toString()}
    </Button>
  );
};
