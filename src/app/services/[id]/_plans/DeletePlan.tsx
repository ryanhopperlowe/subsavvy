import { Button, Text, useDisclosure } from "@chakra-ui/react";

import { ConfirmModal } from "@/components";
import { trpc } from "@/lib";
import { Plan } from "@/model";
import { usePlanShowStore } from "@/store";

export function DeletePlan({
  isDisabled,
  plan,
  onSubmit,
  onCompleted,
}: {
  plan: Plan;
  onSubmit: (plan: Plan) => void;
  onCompleted?: () => void;
  isDisabled: boolean;
}) {
  const { setUpdatedPlan } = usePlanShowStore();

  const utils = trpc.useUtils();
  const deletePlan = trpc.plans.delete.useMutation({ onSettled: onCompleted });

  const modal = useDisclosure();

  const handleDelete = async () => {
    modal.onClose();
    onSubmit(plan);
    setUpdatedPlan(plan.id);
    deletePlan.mutateAsync(plan.id).then(() => utils.plans.invalidate());
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

      <ConfirmModal
        isOpen={!!deletePlan.error}
        onCancel={deletePlan.reset}
        onConfirm={handleDelete}
        title={`Error: ${deletePlan.error?.message}`}
      >
        <Text>Would you like to retry?</Text>
      </ConfirmModal>
    </>
  );
}
