import { Button, useDisclosure } from "@chakra-ui/react";

import { ConfirmModal } from "@/components";
import { trpc } from "@/lib";
import { Plan } from "@/model";

export function DeletePlan({
  isDisabled,
  plan,
  onSuccess,
}: {
  plan: Plan;
  onSuccess: (plan: Plan) => void;
  isDisabled: boolean;
}) {
  const utils = trpc.useUtils();
  const deletePlan = trpc.plans.delete.useMutation();

  const modal = useDisclosure();

  const handleDelete = async () => {
    await deletePlan.mutateAsync(plan.id);

    modal.onClose();
    utils.plans.invalidate();
    onSuccess(plan);
  };

  return (
    <>
      <Button
        colorScheme="error"
        onClick={modal.onOpen}
        isDisabled={isDisabled}
      >
        Delete
      </Button>

      <ConfirmModal
        isOpen={modal.isOpen}
        onCancel={modal.onClose}
        onConfirm={handleDelete}
      />
    </>
  );
}
