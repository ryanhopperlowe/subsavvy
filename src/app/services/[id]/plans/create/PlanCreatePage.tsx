"use client";

import { Box, Button, Flex, FormLabel, Grid, Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

import { RhfCurrencyInput, RhfInput, RhfTextArea } from "@/components";
import { RhfSelect } from "@/components/form/RhfSelect";
import { trpc } from "@/lib";
import { BillFrequency, BillFrequencyOptions, planCreateSchema } from "@/model";

const schema = planCreateSchema;

type Fields = {
  name: string;
  description: string;
  billOptions: {
    key: string;
    price: string | null;
    interval: BillFrequency | null;
  }[];
};

export function PlanCreatePage({ serviceId }: { serviceId: string }) {
  const createPlan = trpc.plans.create.useMutation();

  const form = useForm<Fields>({
    defaultValues: {
      name: "",
      description: "",
      billOptions: [
        { price: null, interval: BillFrequency.MONTHLY, key: uuid() },
      ],
    },
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    data.billOptions.forEach((option) => {
      if (!option.price) throw new Error("Price is required");
      if (!option.interval) throw new Error("Interval is required");
    });

    createPlan.mutate({
      ...data,
      serviceId: Number(serviceId),
      billOptions: data.billOptions.map((option) => ({
        interval: option.interval!,
        price: Number(option.price!),
      })),
    });
  });

  const billOptions = form.watch("billOptions");

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
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

        <FormLabel>Billing options:</FormLabel>
        <Box className="grid grid-cols-8 gap-2 items-start">
          <FormLabel className="col-span-3">Price</FormLabel>
          <FormLabel className="col-span-3">Interval</FormLabel>
          <FormLabel className="col-span-2">Actions</FormLabel>

          {billOptions.map((billOption, index) => (
            <Fragment key={billOption.key}>
              <RhfCurrencyInput
                control={form.control}
                name={`billOptions.${index}.price`}
                classes={{ root: "col-span-3" }}
              />

              <RhfSelect
                control={form.control}
                name={`billOptions.${index}.interval`}
                options={BillFrequencyOptions}
                classes={{ root: "col-span-3" }}
              />

              <Button
                onClick={() =>
                  form.setValue(
                    "billOptions",
                    billOptions.filter((_, i) => i !== index),
                  )
                }
                isDisabled={billOptions.length === 1}
                className="col-span-2"
                colorScheme="error"
              >
                Remove
              </Button>
            </Fragment>
          ))}
        </Box>

        <Button
          onClick={() =>
            form.setValue("billOptions", [
              ...form.watch("billOptions"),
              {
                price: null,
                interval: BillFrequency.MONTHLY,
                key: uuid(),
              },
            ])
          }
          className="mb-2"
        >
          Add Billing Option
        </Button>

        <Button
          type="submit"
          isLoading={createPlan.isLoading}
          colorScheme="prim"
        >
          Create Plan
        </Button>
      </Stack>
    </form>
  );
}
