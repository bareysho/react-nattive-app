import React, { FC, PropsWithChildren, RefObject } from 'react';
import ActionSheetUI, { ActionSheetRef } from 'react-native-actions-sheet';
import { ActionSheetProps } from 'react-native-actions-sheet/dist/src/types';

import { Box, useTheme } from '@src/components/UI';

interface IActionSheet {
  actionSheetRef: RefObject<ActionSheetRef>;
}

export const ActionSheet: FC<
  PropsWithChildren<IActionSheet & ActionSheetProps>
> = ({ children, actionSheetRef, ...rest }) => {
  const { theme } = useTheme();

  return (
    <ActionSheetUI
      {...rest}
      gestureEnabled
      useBottomSafeAreaPadding
      ref={actionSheetRef}
      overdrawSize={200}
      defaultOverlayOpacity={0.7}
      indicatorStyle={{
        width: 100,
      }}
      containerStyle={{
        backgroundColor: theme.cardBackground,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
      }}
    >
      <Box width="100%" mt={4}>
        {children}
      </Box>
    </ActionSheetUI>
  );
};
