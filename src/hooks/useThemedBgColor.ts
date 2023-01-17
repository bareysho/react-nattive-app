import { useColorModeValue } from 'native-base/src/core/color-mode/hooks';

export const useThemedBgColor = () => {
  return useColorModeValue('trueGray.50', 'trueGray.800');
};
