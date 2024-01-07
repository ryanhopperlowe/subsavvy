import { Box, Card, Grid, Stack, Text } from "@chakra-ui/react";

import { LoadingSpinner } from "@/components";
import { formatCurrency, trpc } from "@/lib";
import { BillFrequencyLabels, Service } from "@/model";

export function ServicePlans({ service }: { service: Service }) {
  const getPlans = trpc.plans.getByServiceId.useQuery(service.id);

  if (getPlans.isLoading) {
    return <LoadingSpinner />;
  }

  if (getPlans.error) {
    return getPlans.error.message;
  }

  const plans = getPlans.data!;

  return (
    <Stack spacing={4}>
      <Text fontSize="large">Plan Options:</Text>
      {plans.map((plan) => (
        <Card key={plan.id} className="p-4" bg="prim.900">
          <Text fontSize="large" color="prim.500">
            <b>{plan.name}</b>
          </Text>

          <Text fontSize="small">{plan.description}</Text>

          <Text className="mt-4" fontSize="medium" color="prim.500">
            Bill Options:
          </Text>

          <Box className="grid grid-cols-4 gap-2 content-center text-center">
            {plan.billOptions.map((billOption) => (
              <Card key={billOption.id} className="p-4" color="prim.500">
                <Text fontSize="medium">
                  <b>{BillFrequencyLabels[billOption.interval]}</b>
                </Text>

                <Text fontSize="large">{formatCurrency(billOption.price)}</Text>
              </Card>
            ))}
          </Box>
        </Card>
      ))}
    </Stack>
  );
}
