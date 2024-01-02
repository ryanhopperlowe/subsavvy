"use client";
import { LoadingSpinner } from "@/components";
import { trpc } from "@/lib";
import { Box, Button, Container, Text } from "@chakra-ui/react";

export default function ServicePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const getClient = trpc.services.getById.useQuery(Number(id));

  if (getClient.isLoading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (getClient.error) {
    return <Container>{getClient.error.message}</Container>;
  }

  const service = getClient.data!;

  return (
    <Container>
      <Text fontSize="large">{service.name}</Text>
      <Box>
        <Button variant="outline" colorScheme="prim">
          Add a Plan
        </Button>
      </Box>
    </Container>
  );
}
