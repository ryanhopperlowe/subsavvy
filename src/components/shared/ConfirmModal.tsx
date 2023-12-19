import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import React from "react";

interface ConfirmModalProps {
  title?: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function ConfirmModal(props: ConfirmModalProps) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.title || "Are you Sure?"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{props.children}</ModalBody>

        <ModalFooter className="flex gap-2">
          <Button variant="ghost" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button
            colorScheme="prim"
            variant="solid"
            mr={3}
            onClick={props.onConfirm}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
