"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

interface SsModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

function SsModal(props: SsModalProps) {
  const { children, isOpen, onClose } = props;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}

interface CompositeModalProps {
  children: React.ReactNode;
  className?: string;
}

SsModal.Header = ModalHeader;
SsModal.Body = ModalBody;
SsModal.Footer = function SsModalFooter(props: CompositeModalProps) {
  return (
    <ModalFooter className={"flex justify-end gap-2 " + props.className}>
      {props.children}
    </ModalFooter>
  );
};

export { SsModal };
