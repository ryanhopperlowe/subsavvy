"use client";

import { Button, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { LoadingSpinner } from "@/components";
import { useOnMount } from "@/hooks";
import { trpc } from "@/lib";
import { Identifier } from "@/model";
import { Routes } from "@/routes";

import { PlanDisplay } from "./_plans";

export function ServicePlans({ serviceId }: { serviceId: Identifier }) {
  const router = useRouter();

  const getPlans = trpc.plans.getByServiceId.useQuery(serviceId);

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
        <PlanDisplay key={plan.id} plan={plan} />
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
