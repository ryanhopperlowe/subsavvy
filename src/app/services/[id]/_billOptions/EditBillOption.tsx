import { Button, useDisclosure } from "@chakra-ui/react";
import { ComponentProps } from "react";
import { useForm } from "react-hook-form";

import { LoadingSpinner, RhfCurrencyInput, SsModal } from "@/components";
import { RhfSelect } from "@/components/form/RhfSelect";
import { trpc } from "@/lib";
import { BillFrequency, BillFrequencyOptions, BillOption } from "@/model";
import { usePlanShowStore } from "@/store";

type FormData = {
  price: number;
  interval: BillFrequency;
};

export function EditBillOption({
  billOption,
  onSubmit,
  ButtonProps = {},
  onComplete,
}: {
  billOption: BillOption;
  onSubmit?: (billOption: BillOption) => void;
  ButtonProps?: Partial<ComponentProps<typeof Button>>;
  onComplete: () => void;
}) {
  const { setUpdatedBillOption } = usePlanShowStore();

  const utils = trpc.useUtils();
  const updateBillOption = trpc.billOptions.update.useMutation({
    onSettled: onComplete,
  });

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    modal.onOpen();
    ButtonProps.onClick?.(e);
  };

  const form = useForm<FormData>();

  const modal = useDisclosure({
    onOpen: () => form.reset(billOption),
  });

  const handleSubmit = async (data: FormData) => {
    const newBillOption = { ...billOption, ...data };
    updateBillOption
      .mutateAsync(newBillOption)
      .then(() => utils.plans.invalidate());

    setUpdatedBillOption(newBillOption.id);
    onSubmit?.(newBillOption);
    modal.onClose();
  };

  return (
    <>
      <Button
        {...ButtonProps}
        onClick={handleButtonClick}
        className="flex gap-2"
      >
        Edit
      </Button>

      <SsModal isOpen={modal.isOpen} onClose={modal.onClose}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <SsModal.Header>Edit Bill Option</SsModal.Header>

          <SsModal.Body>
            <RhfCurrencyInput
              control={form.control}
              name="price"
              label="Price"
              isDisabled={form.watch("interval") === BillFrequency.NEVER}
            />

            <RhfSelect
              options={BillFrequencyOptions}
              control={form.control}
              name="interval"
              label="Billing Frequency"
            />
          </SsModal.Body>

          <SsModal.Footer>
            <Button onClick={modal.onClose}>Cancel</Button>

            <Button
              type="submit"
              colorScheme="prim"
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
