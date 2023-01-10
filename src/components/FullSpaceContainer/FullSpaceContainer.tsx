import React, { FC, PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const FullSpaceContainer: FC<
  PropsWithChildren<{ styles?: ViewStyle }>
> = ({ children, styles }) => {
  return <View style={[styles, localStyles.container]}>{children}</View>;
};
