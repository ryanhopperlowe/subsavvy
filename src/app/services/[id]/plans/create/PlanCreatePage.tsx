"use client";

import { Box, Button, Card, FormLabel, Stack, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

import { RhfCurrencyInput, RhfInput, RhfTextArea } from "@/components";
import { RhfSelect } from "@/components/form/RhfSelect";
import { useMedia } from "@/hooks";
import { trpc } from "@/lib";
import {
  BillFrequency,
  BillFrequencyOptions,
  Identifier,
  planCreateSchema,
} from "@/model";
import { Routes } from "@/routes";

const billOptions = planCreateSchema.shape.billOptions.element
  .partial({
    isFree: true,
    price: true,
  })
  .array();

const schema = planCreateSchema.extend({
  billOptions,
});

type Fields = {
  name: string;
  description: string;
  billOptions: {
    key: string;
    price: number | null;
    interval: BillFrequency;
  }[];
  serviceId: Identifier;
};

function newBillOption(): Fields["billOptions"][number] {
  return {
    interval: BillFrequency.MONTHLY,
    key: uuid(),
    price: 0,
  };
}

export function PlanCreatePage({ serviceId }: { serviceId: string }) {
  const router = useRouter();

  const createPlan = trpc.plans.create.useMutation({
    onError: console.error,
  });

  const form = useForm<Fields>({
    defaultValues: {
      name: "",
      description: "",
      billOptions: [newBillOption()],
      serviceId: serviceId,
    },
    resolver: zodResolver(schema),
  });

  const { isMd } = useMedia();

  const handleSubmit = form.handleSubmit(async (data) => {
    await createPlan.mutateAsync({
      ...data,
      serviceId: serviceId,
      billOptions: data.billOptions.map((option) => {
        const isFree = option.interval === BillFrequency.NEVER;

        if (!isFree && !option.price)
          throw new Error("Price is required when not free");
        if (!option.interval) throw new Error("Interval is required");

        return {
          interval: option.interval,
          price: !isFree ? option.price || 0 : 0,
          isFree,
        };
      }),
    });

    router.push(Routes.serviceView.path({ id: serviceId }));
  });

  const billOptions = form.watch("billOptions");
  console.log(billOptions);

  console.log(form.formState.isValid, form.formState.errors);

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <Text fontSize="x-large">Create a Plan</Text>

        <Card className="p-4">
          <RhfInput
            label="Plan Name"
            control={form.control}
            name="name"
            placeholder="e.x. 'Gold Tier'"
          />

          <RhfTextArea
            control={form.control}
            name="description"
            label="Description"
          />
        </Card>

        <Card className="p-4 flex flex-col gap-4">
          <FormLabel>Billing options:</FormLabel>

          {billOptions.map((billOption, index) => {
            const isFree = billOption.interval === BillFrequency.NEVER;

            return (
              <Card
                key={billOption.key}
                className="p-4 grid grid-cols-8 gap-2 items-start"
              >
                <RhfCurrencyInput
                  label={"Price"}
                  control={form.control}
                  name={`billOptions.${index}.price`}
                  placeholder="e.x. 9.99"
                  classes={{ root: "col-span-8 md:col-span-3" }}
                  isDisabled={isFree}
                />

                <RhfSelect
                  label="Billing Interval"
                  control={form.control}
                  name={`billOptions.${index}.interval`}
                  options={BillFrequencyOptions}
                  classes={{ root: "col-span-8 md:col-span-3" }}
                />

                <Box className="col-span-8 md:col-span-2">
                  {isMd && <FormLabel opacity={0}>Actions</FormLabel>}
                  <Button
                    onClick={() =>
                      form.setValue(
                        "billOptions",
                        billOptions.filter((_, i) => i !== index),
                      )
                    }
                    isDisabled={billOptions.length === 1}
                    colorScheme="error"
                    className="w-full"
                  >
                    Remove
                  </Button>
                </Box>
              </Card>
            );
          })}

          <Button
            onClick={() =>
              form.setValue("billOptions", [
                ...form.watch("billOptions"),
                newBillOption(),
              ])
            }
            className="mb-2"
          >
            Add Billing Option
          </Button>
        </Card>

        <Box className="grid grid-cols-2">
          <Button onClick={() => router.back()} className="mr-2">
            Cancel
          </Button>

          <Button
            type="submit"
            colorScheme="prim"
            isDisabled={!form.formState.isValid}
          >
            Create Plan
          </Button>
        </Box>
      </Stack>
    </form>
  );
}
