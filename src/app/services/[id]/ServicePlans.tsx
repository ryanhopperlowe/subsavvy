"use client";

import { Box, Button, Card, Stack, Text } from "@chakra-ui/react";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { LoadingSpinner } from "@/components";
import { formatCurrency, trpc } from "@/lib";
import { BillFrequencyLabels, Identifier, Plan } from "@/model";
import { Routes } from "@/routes";

import { DeletePlan } from "./DeletePlan";
import { EditPlan } from "./EditPlan";

export function ServicePlans({ serviceId }: { serviceId: Identifier }) {
  const router = useRouter();

  const getPlans = trpc.plans.getByServiceId.useQuery(serviceId);

  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);

  useEffect(() => {
    setLoadingPlan(null);
  }, [getPlans.data]);

  const plans = useMemo(() => {
    if (!getPlans.data) return [];

    return getPlans.data.map((plan) =>
      loadingPlan?.id === plan.id
        ? {
            ...plan,
            ...loadingPlan,
          }
        : plan,
    );
  }, [getPlans.data, loadingPlan]);

  if (getPlans.isLoading) {
    return <LoadingSpinner />;
  }

  if (getPlans.error) {
    return getPlans.error.message;
  }

  return (
    <Stack spacing={2}>
      <Text fontSize="large">Plan Options:</Text>

      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={cn("p-4 flex flex-col gap-4", {
            "filter grayscale opacity-60": loadingPlan?.id === plan.id,
          })}
          bg="prim.900"
        >
          <Box className="w-full flex justify-between align-middle gap-4">
            <Text fontSize="large" color="prim.500">
              <b>{plan.name}</b>
            </Text>

            {loadingPlan?.id === plan.id && <LoadingSpinner inline />}
          </Box>

          <Text fontSize="small">{plan.description}</Text>

          <Box>
            <Text fontSize="medium" color="prim.500">
              Bill Options:
            </Text>

            <Box className="grid grid-cols-2 gap-2 content-center text-center md:grid-cols-4">
              {plan.billOptions.map((billOption) => (
                <Card key={billOption.id} className={"p-4"} color="prim.500">
                  <Text fontSize="medium">
                    <b>{BillFrequencyLabels[billOption.interval]}</b>
                  </Text>

                  <Text fontSize="large">
                    {formatCurrency(billOption.price)}
                  </Text>
                </Card>
              ))}
            </Box>
          </Box>

          <Box className="w-full flex gap-2">
            <EditPlan
              plan={plan}
              onSuccess={setLoadingPlan}
              isDisabled={getPlans.isFetching && loadingPlan?.id === plan.id}
            />

            <DeletePlan
              plan={plan}
              onSuccess={setLoadingPlan}
              isDisabled={getPlans.isFetching && loadingPlan?.id === plan.id}
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

const PLAN_FORM_ID = "planForm";
