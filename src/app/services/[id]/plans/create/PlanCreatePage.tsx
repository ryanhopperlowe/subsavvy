"use client";

import { Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { RhfInput, RhfTextArea } from "@/components";
import { trpc } from "@/lib";
import { BillFrequency, planCreateSchema } from "@/model";

const schema = planCreateSchema;

type Fields = {
  name: string;
  description: string;
  billOptions: {
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
      billOptions: [{ price: null, interval: null }],
    },
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
      </Stack>
    </form>
  );
}
