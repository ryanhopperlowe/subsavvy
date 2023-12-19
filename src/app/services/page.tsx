"use client";
import { ConfirmModal } from "@/components/shared";
import { formatDate, trpc } from "@/lib";
import { Box, Button, Container, Text, useDisclosure } from "@chakra-ui/react";

export default function ServiceListPage() {
  const getClients = trpc.services.getAll.useQuery();
  const deleteClient = trpc.services.delete.useMutation();

  const confirm = useDisclosure();

  const handleDelete = async (id: number) => {
    await deleteClient.mutateAsync(id);

    confirm.onClose();
    getClients.refetch();
  };

  return (
    <Container>
      <Box className="flex flex-col gap-4">
        {getClients.data?.map((client) => (
          <Box key={client.id} className="flex justify-between w-full">
            <Box className="flex flex-col">
              <Text>{client.name}</Text>
              <Text>{formatDate(client.createdAt)}</Text>
            </Box>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={confirm.onOpen}
            >
              Delete
            </Button>

            <ConfirmModal
              isOpen={confirm.isOpen}
              onCancel={confirm.onClose}
              onConfirm={() => handleDelete(client.id)}
            >
              <Text>
                Are you sure you want to delete this service? This cannot be
                undone.
              </Text>
            </ConfirmModal>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
