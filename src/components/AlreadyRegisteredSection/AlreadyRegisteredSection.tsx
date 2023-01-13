import React, { FC, useCallback } from 'react';
import { HStack, Link, Text } from 'native-base';

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
    <HStack mt="6" justifyContent="center">
      {hasAccountHint && <Text fontSize="sm">У меня есть аккаунт. </Text>}

      <Link onPress={handlePress}>Войти</Link>
    </HStack>
  );
};
