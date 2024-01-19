import { Button, ButtonProps, useDisclosure } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

import { RetryModal, RhfCurrencyInput, SsModal } from "@/components";
import { RhfSelect } from "@/components/form/RhfSelect";
import { trpc } from "@/lib";
import { BillFrequency, BillFrequencyOptions, BillOption } from "@/model";
import { RequireOneOf } from "@/types";

type FormData = {
  price: number;
  interval: BillFrequency;
};

type EditBillOptionProps = RequireOneOf<{
  billOption: BillOption;
  planId: string;
}> & {
  onSubmit?: (billOption: BillOption) => void;
  ButtonProps?: Partial<ButtonProps>;
  onComplete?: () => void;
  onError?: () => void;
};

export function EditBillOption({
  ButtonProps = {},
  billOption,
  onComplete,
  onError,
  onSubmit,
  planId,
}: EditBillOptionProps) {
  const utils = trpc.useUtils();
  const updateBillOption = trpc.billOptions.update.useMutation({
    onSettled: onComplete,
    onError,
  });
  const createBillOption = trpc.plans.addBillOption.useMutation({
    onSettled: onComplete,
    onError,
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
    let newBillOption: BillOption;

    if (billOption?.id) {
      newBillOption = { ...billOption, ...data };

      updateBillOption
        .mutateAsync(newBillOption)
        .then(() => utils.plans.invalidate());
    } else {
      newBillOption = {
        ...data,
        id: uuid(),
        isFree: data.interval === BillFrequency.NEVER,
        planId,
      } as BillOption;

      createBillOption
        .mutateAsync(newBillOption)
        .then(() => utils.plans.invalidate());
    }

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
        {billOption?.id ? "Edit" : "Add"}
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

      <RetryModal
        isOpen={updateBillOption.isError || createBillOption.isError}
        onCancel={() => {
          updateBillOption.reset();
          createBillOption.reset();
          modal.onOpen();
        }}
        onRetry={() => handleSubmit(form.getValues())}
      />
    </>
  );
}
