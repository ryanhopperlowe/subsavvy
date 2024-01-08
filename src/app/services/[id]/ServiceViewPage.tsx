"use client";

import { Box, Text } from "@chakra-ui/react";

import { LoadingSpinner } from "@/components";
import { trpc } from "@/lib";

import { ServicePlans } from "./ServicePlans";

export function ServiceViewPage({ id }: { id: string }) {
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
      <Text fontSize="x-large">{service.name}</Text>

      <ServicePlans service={service} />
    </Box>
  );
}
