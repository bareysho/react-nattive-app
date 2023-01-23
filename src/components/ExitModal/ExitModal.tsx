import React, { FC, ReactNode } from 'react';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Box, Button, HStack, Icon, Pressable, Text } from '@src/components/UI';

interface IExitModal {
  handleLogout: () => Promise<void>;
  renderComponent: (toggleOpen: () => void) => ReactNode;
  isLoading?: boolean;
}

export const ExitModal: FC<IExitModal> = ({
  handleLogout,
  renderComponent,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const closeModal = () => setIsOpen(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      {renderComponent(toggleOpen)}

      <Modal
        animationInTiming={300}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={0}
        animationOut="slideOutDown"
        isVisible={isOpen}
      >
        <Box alignItems="center" justifyContent="center" flex={1}>
          <Box p={6} width="100%" rounded={15} backgroundColor="white">
            <HStack width="100%" mb={5} justifyContent="space-between">
              <Text fontWeight={500} fontSize={18}>
                Выход
              </Text>

              <Pressable onPress={closeModal}>
                <Icon
                  size={25}
                  color="#57534e"
                  as={<MaterialCommunityIcons name="close-circle" />}
                />
              </Pressable>
            </HStack>

            <Text mb={7}>Вы действительно хотите выйти?</Text>

            <HStack alignSelf="flex-end" alignItems="center">
              <Button mr={4} variant="ghost" onPress={closeModal}>
                Отмена
              </Button>

              <Button isLoading={isLoading} onPress={handleLogout}>
                Выход
              </Button>
            </HStack>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
