"use client";

import { Text } from "@chakra-ui/react";
import { ComponentProps } from "react";

import { ConfirmModal } from "./ConfirmModal";

type RetryModalProps = Omit<
  ComponentProps<typeof ConfirmModal>,
  "onConfirm"
> & {
  onRetry: () => void;
  message?: string;
};

export function RetryModal(props: RetryModalProps) {
  return (
    <ConfirmModal
      title={props.title || "Error"}
      isOpen={props.isOpen}
      onCancel={props.onCancel}
      onConfirm={props.onRetry}
      confirmLabel={props.confirmLabel || "Retry"}
      cancelLabel={props.cancelLabel || "Cancel"}
    >
      {props.children || (
        <>
          <Text>Error: {props.message}</Text>
          <Text>Would you like to try again?</Text>{" "}
        </>
      )}
    </ConfirmModal>
  );
}
