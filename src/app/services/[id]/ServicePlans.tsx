"use client";

import { Box, Button, Card, Stack, Text } from "@chakra-ui/react";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { LoadingSpinner } from "@/components";
import { formatCurrency, trpc } from "@/lib";
import { BillFrequencyLabels, BillOption, Identifier, Plan } from "@/model";
import { Routes } from "@/routes";

import { DeletePlan } from "./DeletePlan";
import { EditBillOption } from "./EditBillOption";
import { EditPlan } from "./EditPlan";

export function ServicePlans({ serviceId }: { serviceId: Identifier }) {
  const router = useRouter();

  const getPlans = trpc.plans.getByServiceId.useQuery(serviceId);

  const [updatedPlan, setUpdatedPlan] = useState<Plan | null>(null);
  const [deletedPlan, setDeletedPlan] = useState<Plan | null>(null);

  const [updatedBillOption, setUpdatedBillOption] = useState<BillOption | null>(
    null,
  );

  const isPlanLoading = (id: Identifier) =>
    getPlans.isFetching && [updatedPlan?.id, deletedPlan?.id].includes(id);

  useEffect(() => {
    setUpdatedPlan(null);
    setDeletedPlan(null);
    setUpdatedBillOption(null);
  }, [getPlans.data]);

  if (getPlans.isLoading) {
    return <LoadingSpinner />;
  }

  if (getPlans.error) {
    return getPlans.error.message;
  }

  const plans = getPlans.data || [];

  return (
    <Stack spacing={2}>
      <Text fontSize="large">Plan Options:</Text>

      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={cn("p-4 flex flex-col gap-4", {
            "filter grayscale opacity-60": deletedPlan?.id === plan.id,
          })}
          bg="prim.900"
        >
          <Box className="w-full flex justify-between align-middle gap-4">
            <Text fontSize="large" color="prim.500">
              <b>{plan.name}</b>
            </Text>

            {isPlanLoading(plan.id) && <LoadingSpinner inline />}
          </Box>

          <Text fontSize="small">{plan.description}</Text>

          <Box>
            <Text fontSize="medium" color="prim.500">
              Bill Options:
            </Text>

            <Box className="grid grid-cols-2 gap-2 content-center text-center md:grid-cols-4">
              {plan.billOptions.map((billOption) => {
                const isEdited = updatedBillOption?.id === billOption.id;

                return (
                  <Card
                    key={billOption.id}
                    className={cn("p-4", {
                      "filter grayscale opacity-60": isEdited,
                    })}
                    color="prim.500"
                  >
                    <Text fontSize="medium">
                      <b>{BillFrequencyLabels[billOption.interval]}</b>
                    </Text>

                    <Text fontSize="large">
                      {formatCurrency(billOption.price)}
                    </Text>

                    <EditBillOption
                      billOption={billOption}
                      onSuccess={setUpdatedBillOption}
                      ButtonProps={{ isDisabled: isEdited }}
                    />
                  </Card>
                );
              })}
            </Box>
          </Box>

          <Box className="w-full flex gap-2">
            <EditPlan
              plan={plan}
              onSuccess={setUpdatedPlan}
              isDisabled={isPlanLoading(plan.id)}
            />

            <DeletePlan
              plan={plan}
              onSuccess={setDeletedPlan}
              isDisabled={isPlanLoading(plan.id)}
            />
          </Box>
        </Card>
      ))}

      <Button
        colorScheme="prim"
        onClick={() =>
          router.push(Routes.createPlan.path({ id: String(serviceId) }))
        }
      >
        Add a Plan
      </Button>
    </Stack>
  );
}
