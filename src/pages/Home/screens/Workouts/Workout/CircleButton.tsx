import React, { FC } from 'react';
import { Button, Spinner } from 'native-base';

interface ICircleButton {
  text: string | number;
  backgroundColor: string;
  pressedBackgroundColor: string;
  loaderColor?: string;
  shadow?: number;
  onPress?: () => void;
  withLoading?: boolean;
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
      width={200}
      height={200}
      rounded={100}
      borderWidth={8}
      _pressed={{
        backgroundColor: pressedBackgroundColor,
      }}
      shadow={shadow}
      borderColor="gray.200"
      onPress={onPress}
      backgroundColor={backgroundColor}
      _text={{ fontSize: 60, fontWeight: 300, color: 'gray.900' }}
    >
      {withLoading && (
        <Spinner
          width="100%"
          height="100%"
          top={-42}
          size={320}
          zIndex={5}
          position="absolute"
          color={loaderColor || backgroundColor}
          borderColor={backgroundColor}
        />
      )}

      {text.toString()}
    </Button>
  );
};
