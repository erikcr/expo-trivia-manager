import React, { useEffect, useState } from 'react';
import {
  Box,
  Modal,
  useToast,
  ToastDescription,
  ToastTitle,
  VStack,
  Icon,
  HStack,
  FormControl,
  Input,
  Button,
  Heading,
  Textarea,
  Toast,
  CheckCircleIcon,
  CloseIcon,
  FormControlLabelText,
  FormControlLabel,
  InputField,
  TextareaInput,
  ButtonText,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalBackdrop,
  ModalContent,
} from '@gluestack-ui/themed';

const handleClose = (setModalVisible: any) => {
  setModalVisible(false);
};

const CreateEventModal = ({ modalVisible, setModalVisible }: any) => {
  const [modalFormStep, setModalFormStep] = useState(0);

  useEffect(() => {
    setModalFormStep(0);
  }, []);

  const toast = useToast();

  return (
    <Box>
      {/* Modal: example */}
      <Modal
        size="md"
        isOpen={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        avoidKeyboard
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <HStack alignItems="center">
              <Heading size="sm" fontWeight="$semibold">
                New event
              </Heading>
            </HStack>
            <ModalCloseButton>
              <Icon as={CloseIcon} sx={{ w: 16, h: 16 }} />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <VStack space="md">
              <VStack space="sm">
                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText>Title</FormControlLabelText>
                  </FormControlLabel>
                  <Input w="100%">
                    <InputField placeholder="Enter property name" />
                  </Input>
                </FormControl>
                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText>Description</FormControlLabelText>
                  </FormControlLabel>
                  {/* textarea: example */}
                  <Textarea>
                    <TextareaInput placeholder="Provide description" />
                  </Textarea>
                </FormControl>
              </VStack>

              <CreateButton setModalVisible={setModalVisible} toast={toast} />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const RenderToast = ({ description, title, id }: any) => {
  return (
    <Toast action="success" id={id} top={150}>
      <HStack alignItems="center" space="xs">
        <Icon as={CheckCircleIcon} />
        <ToastTitle>{title}</ToastTitle>
        <ToastDescription>{description}</ToastDescription>
      </HStack>
    </Toast>
  );
};

const CreateButton = ({ setModalVisible, toast }: any) => {
  return (
    <Button
      onPress={() => {
        handleClose(setModalVisible);
        toast.show({
          placement: 'top',
          render: ({ id }: any) => {
            return (
              <RenderToast
                description="Your event has been created."
                title="Nice!"
                nativeId={id}
              />
            );
          },
        });
      }}
    >
      <ButtonText>Post Now</ButtonText>
    </Button>
  );
};

export default CreateEventModal;
