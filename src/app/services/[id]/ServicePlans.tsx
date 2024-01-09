"use client";

import { Box, Button, Card, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { LoadingSpinner, SsModal } from "@/components";
import { formatCurrency, trpc } from "@/lib";
import { BillFrequencyLabels, Service } from "@/model";
import { Routes } from "@/routes";

import { EditPlanForm } from "./EditPlanForm";

export function ServicePlans({ service }: { service: Service }) {
  const router = useRouter();

  const getPlans = trpc.plans.getByServiceId.useQuery(service.id);

  const [planToEditId, setPlanToEditId] = useState<number | null>(null);
  const onClosePlanModal = () => setPlanToEditId(null);

  if (getPlans.isLoading) {
    return <LoadingSpinner />;
  }

  if (getPlans.error) {
    return getPlans.error.message;
  }

  const plans = getPlans.data!;

  return (
    <Stack spacing={2}>
      <Text fontSize="large">Plan Options:</Text>

      {plans.map((plan) => (
        <Card key={plan.id} className="p-4 flex flex-col gap-4" bg="prim.900">
          <Text fontSize="large" color="prim.500">
            <b>{plan.name}</b>
          </Text>

          <Text fontSize="small">{plan.description}</Text>

          <Box>
            <Text fontSize="medium" color="prim.500">
              Bill Options:
            </Text>

            <Box className="grid grid-cols-2 gap-2 content-center text-center md:grid-cols-4">
              {plan.billOptions.map((billOption) => (
                <Card key={billOption.id} className="p-4" color="prim.500">
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

          <Button
            onClick={() => setPlanToEditId(plan.id)}
            variant="solid"
            colorScheme="prim"
          >
            Edit Plan
          </Button>

          <SsModal isOpen={planToEditId === plan.id} onClose={onClosePlanModal}>
            <SsModal.Header>Edit Plan</SsModal.Header>

            <SsModal.Body>
              <EditPlanForm
                plan={plan}
                onSuccess={onClosePlanModal}
                formId={PLAN_FORM_ID}
              />
            </SsModal.Body>

            <SsModal.Footer>
              <Button
                colorScheme="prim"
                variant="ghost"
                onClick={onClosePlanModal}
              >
                Close
              </Button>

              <Button
                type="submit"
                colorScheme="prim"
                variant="solid"
                form={PLAN_FORM_ID}
              >
                Save
              </Button>
            </SsModal.Footer>
          </SsModal>
        </Card>
      ))}

      <Button
        colorScheme="prim"
        onClick={() =>
          router.push(Routes.createPlan.path({ id: String(service.id) }))
        }
      >
        Add a Plan
      </Button>
    </Stack>
  );
}

const PLAN_FORM_ID = "planForm";
