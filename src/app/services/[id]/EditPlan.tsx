import { Button, useDisclosure } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { RhfInput, RhfTextArea, SsModal } from "@/components";
import { trpc } from "@/lib";
import { Plan } from "@/model";

interface FormData {
  name: string;
  description: string | null;
}

export function EditPlan({
  plan,
  onSuccess,
  isDisabled,
}: {
  onSuccess: (plan: Plan) => void;
  plan: Plan;
  isDisabled?: boolean;
}) {
  const updatePlan = trpc.plans.update.useMutation();

  const utils = trpc.useUtils();

  const form = useForm<FormData>({ defaultValues: plan });
  const modal = useDisclosure();

  const handleSubmit = form.handleSubmit(async (data) => {
    const newPlan: Plan = { ...plan, ...data };
    await updatePlan.mutateAsync(newPlan);

    modal.onClose();
    onSuccess(newPlan);
    utils.plans.getByServiceId.invalidate(plan.serviceId);
  });

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
        <form onSubmit={handleSubmit}>
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
    </>
  );
}
