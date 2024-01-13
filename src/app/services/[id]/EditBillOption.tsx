import { Button, useDisclosure } from "@chakra-ui/react";
import { ComponentProps } from "react";
import { useForm } from "react-hook-form";

import { LoadingSpinner, RhfCurrencyInput, SsModal } from "@/components";
import { RhfSelect } from "@/components/form/RhfSelect";
import { trpc } from "@/lib";
import { BillFrequency, BillFrequencyOptions, BillOption } from "@/model";

type FormData = {
  price: number;
  interval: BillFrequency;
};

export function EditBillOption({
  billOption,
  onSuccess,
  ButtonProps = {},
}: {
  billOption: BillOption;
  onSuccess?: (billOption: BillOption) => void;
  ButtonProps?: Partial<ComponentProps<typeof Button>>;
}) {
  const utils = trpc.useUtils();
  const updateBillOption = trpc.billOptions.update.useMutation();

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    modal.onOpen();
    ButtonProps.onClick?.(e);
  };

  const form = useForm<FormData>();

  const modal = useDisclosure({
    onOpen: () => form.reset(billOption),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const newBillOption = { ...billOption, ...data };
    updateBillOption
      .mutateAsync(newBillOption)
      .then(() => utils.plans.invalidate());
    onSuccess?.(newBillOption);
    modal.onClose();
  });

  return (
    <>
      <Button
        {...ButtonProps}
        onClick={handleButtonClick}
        className="flex gap-2"
      >
        Edit {ButtonProps?.isDisabled && <LoadingSpinner inline size="sm" />}
      </Button>

      <SsModal isOpen={modal.isOpen} onClose={modal.onClose}>
        <form onSubmit={onSubmit}>
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
