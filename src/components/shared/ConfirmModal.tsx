"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

interface ConfirmModalProps {
  title?: string;
  children?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmModal(props: ConfirmModalProps) {
  const {
    children = "This action cannot be undone.",
    title = "Are you sure?",
    isOpen,
    onCancel,
    onConfirm,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
  } = props;

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title || "Are you Sure?"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>

        <ModalFooter className="flex gap-2">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button colorScheme="prim" variant="solid" mr={3} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
