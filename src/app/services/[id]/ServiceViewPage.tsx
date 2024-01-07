"use client";

import { Box, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { LoadingSpinner } from "@/components";
import { trpc } from "@/lib";
import { Routes } from "@/routes";

import { ServicePlans } from "./ServicePlans";

export function ServiceViewPage({ id }: { id: string }) {
  const router = useRouter();

  const getClient = trpc.services.getById.useQuery(Number(id));

  if (getClient.isLoading) {
    return <LoadingSpinner />;
  }

  if (getClient.error) {
    return getClient.error.message;
  }

  const service = getClient.data!;

  return (
    <Box>
      <Text fontSize="large">{service.name}</Text>
      <Box>
        <Button
          variant="outline"
          colorScheme="prim"
          onClick={() => router.push(Routes.createPlan.path({ id }))}
        >
          Add a Plan
        </Button>
      </Box>

      <ServicePlans service={service} />
    </Box>
  );
}
