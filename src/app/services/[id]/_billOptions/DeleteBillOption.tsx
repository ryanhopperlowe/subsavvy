import { Button, useDisclosure } from "@chakra-ui/react";

import { ConfirmModal, RetryModal } from "@/components";
import { trpc } from "@/lib";
import { BillOption } from "@/model";
import { usePlanShowStore } from "@/store";

export function DeleteBillOption({
  isDisabled,
  billOption,
  onSubmit,
  onCompleted,
}: {
  billOption: BillOption;
  onSubmit: (billOption: BillOption) => void;
  onCompleted?: () => void;
  isDisabled: boolean;
}) {
  const { setUpdatedBillOption } = usePlanShowStore();

  const utils = trpc.useUtils();
  const deleteBillOption = trpc.billOptions.delete.useMutation({
    onSettled: onCompleted,
    onError: () => setUpdatedBillOption(null),
  });

  const modal = useDisclosure();

  const handleDelete = async () => {
    onSubmit(billOption);
    setUpdatedBillOption(billOption.id);
    modal.onClose();
    deleteBillOption
      .mutateAsync(billOption.id)
      .then(() => utils.plans.invalidate());
  };

  return (
    <>
      <Button
        colorScheme="error"
        isDisabled={isDisabled}
        onClick={modal.onOpen}
      >
        Delete
      </Button>

      <ConfirmModal
        isOpen={modal.isOpen}
        onCancel={modal.onClose}
        onConfirm={handleDelete}
      />

      <RetryModal
        isOpen={!!deleteBillOption.error}
        onCancel={deleteBillOption.reset}
        onRetry={handleDelete}
        title={`Error: ${deleteBillOption.error?.message}`}
      />
    </>
  );
}
