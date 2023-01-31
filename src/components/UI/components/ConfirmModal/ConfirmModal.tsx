import React, { FC, ReactNode } from 'react';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Box,
  Button,
  HStack,
  Icon,
  Pressable,
  Text,
  useTheme,
} from '@src/components/UI';

interface IExitModal {
  confirm: () => Promise<void> | void;
  renderComponent: (toggleOpen: () => void) => ReactNode;
  modalTitle: string;
  confirmButtonTitle: string;
  isLoading?: boolean;
  modalDescription?: string;
}

export const ConfirmModal: FC<IExitModal> = ({
  confirm,
  confirmButtonTitle,
  modalTitle,
  modalDescription,
  renderComponent,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const closeModal = () => setIsOpen(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const { theme } = useTheme();

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
          <Box
            p={6}
            width="100%"
            rounded={15}
            backgroundColor={theme.cardBackground}
          >
            <HStack width="100%" mb={5} justifyContent="space-between">
              <Text fontWeight={500} fontSize={18}>
                {modalTitle}
              </Text>

              <Pressable rounded={25} onPress={closeModal}>
                <Icon
                  size={25}
                  as={<MaterialCommunityIcons name="close-circle" />}
                />
              </Pressable>
            </HStack>

            {modalDescription && <Text mb={7}>{modalDescription}</Text>}

            <HStack alignSelf="flex-end" alignItems="center">
              <Button mr={4} variant="ghost" onPress={closeModal}>
                Отмена
              </Button>

              <Button isLoading={isLoading} onPress={confirm}>
                {confirmButtonTitle}
              </Button>
            </HStack>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
