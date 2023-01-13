import React, { FC, useCallback } from 'react';
import { HStack, Link, Text } from 'native-base';

interface IAlreadyRegisteredSection {
  navigate: (screen: string) => void;
}
export const AlreadyRegisteredSection: FC<IAlreadyRegisteredSection> = ({
  navigate,
}) => {
  const handlePress = useCallback(() => {
    navigate('Login');
  }, [navigate]);

  return (
    <HStack mt="6" justifyContent="center">
      <Text fontSize="sm">У меня есть аккаунт. </Text>

      <Link onPress={handlePress}>Войти</Link>
    </HStack>
  );
};
