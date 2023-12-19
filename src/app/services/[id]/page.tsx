"use client";
import { trpc } from "@/lib";
import { Container } from "@chakra-ui/react";

export default function ServicePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const getClient = trpc.services.getById.useQuery(Number(id));

  return (
    <Container>
      <h1>ServicePage</h1>
      <pre>{JSON.stringify(getClient.data, null, 2)}</pre>
    </Container>
  );
}
