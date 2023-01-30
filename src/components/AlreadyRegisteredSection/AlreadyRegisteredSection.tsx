import React, { FC, useCallback } from 'react';

import { HStack, Text, Button } from '@src/components/UI';

interface IAlreadyRegisteredSection {
  navigate: (screen: string) => void;
  hasAccountHint?: boolean;
}
export const AlreadyRegisteredSection: FC<IAlreadyRegisteredSection> = ({
  navigate,
  hasAccountHint = true,
}) => {
  const handlePress = useCallback(() => {
    navigate('Login');
  }, [navigate]);

  return (
    <HStack width="100%" mt={6} alignItems="center" justifyContent="center">
      {hasAccountHint && <Text fontSize={14}>У меня есть аккаунт. </Text>}

      <Button variant="ghost" onPress={handlePress}>
        Войти
      </Button>
    </HStack>
  );
};
