import { Button, useDisclosure } from "@chakra-ui/react";
import { error } from "console";
import { useForm } from "react-hook-form";

import { RetryModal, RhfInput, RhfTextArea, SsModal } from "@/components";
import { trpc } from "@/lib";
import { Plan } from "@/model";

interface FormData {
  name: string;
  description: string | null;
}

export function EditPlan({
  plan,
  onSubmit,
  isDisabled,
  onCompleted,
}: {
  onSubmit: (plan: Plan) => void;
  plan: Plan;
  isDisabled?: boolean;
  onCompleted?: () => void;
}) {
  const updatePlan = trpc.plans.update.useMutation({
    onSettled: onCompleted,
  });

  const utils = trpc.useUtils();

  const form = useForm<FormData>();
  const modal = useDisclosure({
    onOpen: () => !updatePlan.isError && form.reset(plan),
  });

  const handleSubmit = async (data: FormData) => {
    const newPlan: Plan = { ...plan, ...data };

    updatePlan.mutateAsync(newPlan).then(() => utils.plans.invalidate());
    modal.onClose();
    onSubmit(newPlan);
  };

  return (
    <>
      <Button
        onClick={modal.onOpen}
        variant="outline"
        colorScheme="prim"
        isDisabled={isDisabled}
      >
        Edit Plan
      </Button>

      <SsModal isOpen={modal.isOpen} onClose={modal.onClose}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <SsModal.Header>Edit Plan</SsModal.Header>

          <SsModal.Body>
            <RhfInput name="name" label="Name" control={form.control} />

            <RhfTextArea
              name="description"
              label="Description"
              control={form.control}
            />
          </SsModal.Body>

          <SsModal.Footer>
            <Button colorScheme="prim" variant="ghost" onClick={modal.onClose}>
              Close
            </Button>

            <Button
              type="submit"
              colorScheme="prim"
              variant="solid"
              isDisabled={!form.formState.isDirty || !form.formState.isValid}
            >
              Save
            </Button>
          </SsModal.Footer>
        </form>
      </SsModal>

      <RetryModal
        isOpen={updatePlan.isError}
        onCancel={() => {
          updatePlan.reset();
          modal.onOpen();
        }}
        onRetry={() => handleSubmit(form.getValues())}
        message={updatePlan.error?.message}
      />
    </>
  );
}
