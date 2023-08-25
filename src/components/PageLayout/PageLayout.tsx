import React, { FC, Fragment, PropsWithChildren, useContext } from 'react';
import styled from 'styled-components/native';

import { Box, Center, Spinner, useTheme } from '@src/components/UI';
import { ScreenLoadingContext } from '@src/providers/ScreenLoadingProvider';
import { IBaseElementStyleProps } from '@src/components/UI/types/common';

const StyledScrollView = styled.ScrollView<{ backgroundColor: string }>`
  width: 100%;
  background-color: ${props => props.backgroundColor};
`;

const ScrollWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <StyledScrollView backgroundColor={theme.background}>
      {children}
    </StyledScrollView>
  );
};

export const PageLayout: FC<
  PropsWithChildren<
    { withScroll?: boolean; p?: number } & IBaseElementStyleProps
  >
> = ({ children, withScroll = false, p = 4, ...boxProps }) => {
  const { isScreenLoading } = useContext(ScreenLoadingContext);

  const { theme } = useTheme();

  const Wrapper = withScroll ? ScrollWrapper : Fragment;

  return isScreenLoading ? (
    <Center backgroundColor={theme.background} flex={1}>
      <Spinner size={60} />
    </Center>
  ) : (
    <Wrapper>
      <Box
        {...boxProps}
        p={p}
        flex={1}
        width="100%"
        height="100%"
        backgroundColor={theme.background}
      >
        {children}
      </Box>
    </Wrapper>
  );
};
