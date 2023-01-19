import React, { FC, ReactNode } from 'react';
import { AlertDialog, Button, Center, Pressable } from 'native-base';

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

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <Center>
      <Pressable onPress={toggleOpen}>{renderComponent(toggleOpen)}</Pressable>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />

          <AlertDialog.Header borderBottomWidth={0}>Выход</AlertDialog.Header>

          <AlertDialog.Body>Вы действительно хотите выйти?</AlertDialog.Body>

          <AlertDialog.Footer borderTopWidth={0}>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
              >
                Отмена
              </Button>

              <Button isLoading={isLoading} onPress={handleLogout}>
                Выход
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
};
