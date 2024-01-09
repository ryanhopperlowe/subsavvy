import { useForm } from "react-hook-form";

import { RhfInput, RhfTextArea } from "@/components";
import { trpc } from "@/lib";
import { Plan } from "@/model";

interface EditPlanFormProps {
  formId: string;
  onSuccess: (plan: Plan) => void;
  plan: Plan;
}

interface FormData {
  name: string;
  description: string | null;
}

export function EditPlanForm({ plan, onSuccess, formId }: EditPlanFormProps) {
  const updatePlan = trpc.plans.update.useMutation();

  const utils = trpc.useUtils();

  const form = useForm<FormData>({ defaultValues: plan });

  const handleSubmit = form.handleSubmit(async (data) => {
    await updatePlan.mutateAsync({
      id: plan.id,
      serviceId: plan.serviceId,
      ...data,
    });

    onSuccess(plan);
    utils.plans.getByServiceId.invalidate(plan.serviceId);
  });

  return (
    <form onSubmit={handleSubmit} id={formId}>
      <RhfInput name="name" label="Name" control={form.control} />

      <RhfTextArea
        name="description"
        label="Description"
        control={form.control}
      />
    </form>
  );
}
