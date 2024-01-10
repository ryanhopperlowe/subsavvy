"use client";

import { Box, Text } from "@chakra-ui/react";

import { LoadingSpinner } from "@/components";
import { trpc } from "@/lib";
import { Identifier } from "@/model";

import { ServicePlans } from "./ServicePlans";

export function ServiceViewPage({ id }: { id: Identifier }) {
  const getClient = trpc.services.getById.useQuery(id);

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

      <ServicePlans serviceId={service.id} />
    </Box>
  );
}
