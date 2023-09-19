"use client";
import { formatDate, trpc } from "@/lib";
import { Box, Container, Text } from "@chakra-ui/react";

export default function ServiceListPage() {
  const getClients = trpc.services.getAll.useQuery();

  console.log(getClients.data);

  return (
    <Container>
      <Box className="flex flex-col gap-4">
        {getClients.data?.map((client) => (
          <Box key={client.id}>
            <Text>{client.name}</Text>
            <Text>{formatDate(client.createdAt)}</Text>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
