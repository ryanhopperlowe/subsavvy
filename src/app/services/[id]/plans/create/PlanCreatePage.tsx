"use client";

import { Box, Button, Card, FormLabel, Stack, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

import { RhfCurrencyInput, RhfInput, RhfTextArea } from "@/components";
import { RhfSelect } from "@/components/form/RhfSelect";
import { trpc } from "@/lib";
import { BillFrequency, BillFrequencyOptions, planCreateSchema } from "@/model";
import { Routes } from "@/routes";

const schema = planCreateSchema;

type Fields = {
  name: string;
  description: string;
  billOptions: {
    key: string;
    price: string | null;
    interval: BillFrequency | null;
  }[];
  serviceId: number;
};

export function PlanCreatePage({ serviceId }: { serviceId: string }) {
  const router = useRouter();

  const createPlan = trpc.plans.create.useMutation({
    onError: console.error,
  });

  const form = useForm<Fields>({
    defaultValues: {
      name: "",
      description: "",
      billOptions: [
        { price: null, interval: BillFrequency.MONTHLY, key: uuid() },
      ],
      serviceId: Number(serviceId),
    },
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    data.billOptions.forEach((option) => {
      if (!option.price) throw new Error("Price is required");
      if (!option.interval) throw new Error("Interval is required");
    });

    await createPlan.mutateAsync({
      ...data,
      serviceId: Number(serviceId),
      billOptions: data.billOptions.map((option) => ({
        interval: option.interval!,
        price: Number(option.price!),
      })),
    });

    router.push(Routes.serviceView.path({ id: serviceId }));
  });

  const billOptions = form.watch("billOptions");

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

          {billOptions.map((billOption, index) => (
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
              />

              <RhfSelect
                label="Billing Interval"
                control={form.control}
                name={`billOptions.${index}.interval`}
                options={BillFrequencyOptions}
                classes={{ root: "col-span-8 md:col-span-3" }}
              />

              <Box className="col-span-8 md:col-span-2">
                <FormLabel opacity={0}>Actions</FormLabel>
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
          ))}

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
        </Card>

        <Box className="grid grid-cols-2">
          <Button onClick={() => router.back()} className="mr-2">
            Cancel
          </Button>

          <Button type="submit" colorScheme="prim">
            Create Plan
          </Button>
        </Box>
      </Stack>
    </form>
  );
}
