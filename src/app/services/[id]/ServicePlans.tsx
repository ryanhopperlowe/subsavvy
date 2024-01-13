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
    [updatedPlan?.id, deletedPlan?.id].includes(id);

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

      {plans.map((plan) => {
        const isPlanEdited = isPlanLoading(plan.id);

        return (
          <Card
            key={plan.id}
            className={cn("p-4 flex flex-col gap-4", {
              "filter grayscale opacity-60": isPlanEdited,
            })}
            bg="prim.900"
          >
            <Box className="w-full flex justify-between items-center gap-4">
              <Text
                fontSize="large"
                color="prim.500"
                className="flex gap-4 items-center"
              >
                {isPlanEdited && <LoadingSpinner inline size="md" />}
                <b>{plan.name}</b>
              </Text>

              <Box className="flex gap-2">
                <EditPlan
                  plan={plan}
                  onSubmit={setUpdatedPlan}
                  isDisabled={isPlanEdited}
                  onError={() => setUpdatedPlan(null)}
                />

                <DeletePlan
                  plan={plan}
                  onSubmit={setDeletedPlan}
                  onError={() => setDeletedPlan(null)}
                  isDisabled={isPlanEdited}
                />
              </Box>
            </Box>

            <Text fontSize="small">{plan.description}</Text>

            <Box>
              <Text fontSize="medium" color="prim.500">
                Bill Options:
              </Text>

              <Box className="flex flex-col gap-2">
                {plan.billOptions.map((billOption) => {
                  const isEdited = updatedBillOption?.id === billOption.id;

                  return (
                    <Card
                      key={billOption.id}
                      className={cn(
                        "flex flex-row items-center justify-between p-4",
                        {
                          "filter grayscale opacity-60": isEdited,
                        },
                      )}
                      color="prim.500"
                    >
                      <Box as="span" className="flex flex-col gap-2">
                        <Text as="span" fontSize="medium">
                          <b>{BillFrequencyLabels[billOption.interval]}</b>
                        </Text>

                        <Text as="span" fontSize="large">
                          {formatCurrency(billOption.price)}
                        </Text>
                      </Box>

                      <Box>
                        <EditBillOption
                          billOption={billOption}
                          onSuccess={setUpdatedBillOption}
                          ButtonProps={{ isDisabled: isEdited }}
                        />
                      </Box>
                    </Card>
                  );
                })}
              </Box>
            </Box>
          </Card>
        );
      })}

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
